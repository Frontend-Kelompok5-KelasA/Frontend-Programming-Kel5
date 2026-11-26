"use client";

import React, {useEffect, useState} from "react";
import {Button, Card} from "react-bootstrap";
import {useForm} from "react-hook-form";
import {useParams} from "next/navigation";
import {upload} from "@vercel/blob/client";
import {loadSession} from "@/script/utils";

export default function ManageContentById(){
  const params: {id: string} = useParams();

  const [data, setData] = useState({});

  const [process, setProcess] = useState<boolean>(false);

  const { register, handleSubmit, reset } = useForm({defaultValues: structuredClone(data)});

  const [success, setSuccess] = useState("");

  const tasks: Promise<void>[] = [];
  const processComponent = (result: any, cloned: any, original: any) => {
    if(!result)return;

    Object.entries(result).map(async ([id, data]: [string, any]) => {
      if(id.startsWith("src")){
        const file = data[0];
        if(!file){
          // @ts-ignore
          cloned[id] = original[id];
          return;
        }

        tasks.push(upload(`uploads/${Date.now()}-${file.name}`, file, {
          access: "public",
          handleUploadUrl: "/api/vercel-blob",
        }).then((blob: any) => {
          cloned[id] = blob.url
        }));
        return;
      }

      if(typeof data === "object"){
        processComponent(data, cloned[id], original[id]);
      }
    });
  };

  const onSubmit = async (result: any, id: string) => {
    setProcess(true);

    let cloned = structuredClone(data);
    //@ts-ignore
    cloned[id] = result[id];

    processComponent(result, cloned, data);

    await Promise.all(tasks);
    tasks.length = 0;

    setData(cloned);

    await fetch(`/api/config/${params.id}`, { method: "POST", body: JSON.stringify({ pageData: cloned }) });

    setSuccess(id);
    setProcess(false);
  };

  const propertyIdToName = (id: string) => {
    return id.replace("src", "Image URL")
      .replace("alt", "Alt Text")
      .replace("-", " ")
      .replace(/(^|\s)\S/g, (char) => char.toUpperCase());
  }

  const loadProperties = (properties: any, pathId: string) => {
    const isMultiple = Object.entries(properties).length > 1;
    return Object.entries(properties).map(([propertyId, propertyData]: [string, any]) => {
      return (
        <div key={propertyId} className="text-start">
          {isMultiple ? <div> <span className="form-label"> {propertyIdToName(propertyId)} </span> <br /> </div> : null}
          {propertyId == "src" ?
            <input type="file"
                   accept="image/*"
                   className="col-10 form-control"
                   // @ts-ignore
                   {...register((pathId + "." + propertyId) as any)}
            /> : <input type="text"
                        required
                        defaultValue={propertyData}
                        className="col-10 form-control"
                        // @ts-ignore
                        {...register((pathId + "." + propertyId) as any)}
            />}
        </div>
      );
    });
  };

  const loadInnerComponent = (compData: any, pathId: string) => {
    const stringInput = (propertyId: string, data: string, i: number) => {
      return (
        <div key={propertyId}>
          <input type="text"
            // @ts-ignore
                 {...register((pathId + "." + i + "." + propertyId) as any)}
                 required
                 defaultValue={data}
                 className="col-12"
          />
        </div>
      );
    }

    return (
      <div>
        {compData.map((inner: any, i: number) => {
          return Object.entries(inner).map(([id, data]: [string, any]) => {
            if(id === "id")return null;
            return(
              <div key={id}>
                <span className="fs-5">
                  {propertyIdToName(id.charAt(0).toUpperCase() + id.slice(1)) + `-${i+1}`}
                </span>
                { typeof data === "string" ? stringInput(id, data, i)
                  : loadProperties(data, pathId + "." + i + "." + id)
                }
                <br />
              </div>
            )
          })
        })}
      </div>
    )
  };

  const loadComponents = (components: any, sectionId: string) => {
    return Object.entries(components).map(([compId, compData]: [string, any]) => {
      return (
        <div key={compId}>
          <span className="fs-5 fw-bold">
            { propertyIdToName(compId.charAt(0).toUpperCase() + compId.slice(1)) }
          </span>
          <br />
          { Array.isArray(compData) ? loadInnerComponent(compData, sectionId + "." + compId)
            : loadProperties(compData, sectionId + "." + compId) }
          <br />
        </div>
      );
    });
  };

  const formatName = (name: string) => {
    return name.slice(0, 1).toUpperCase() + name.slice(1);
  }

  useEffect(() => {
    const retrieveData = async() => {
      const res = await fetch(`/api/config/${params.id}`, {method: 'GET'});

      const { config } = await res.json();

      if(!config)return;

      setData(config);
    }

    loadSession();

    retrieveData();
  }, [params.id, reset]);

  return (
    <main>
      <div className="container">
        <div className="d-flex flex-column justify-content-center align-items-center py-2">
          <span className="fs-2 fw-bold"> {formatName(params.id)} Page </span>

          {Object.keys(data).length === 0 ? <span> Memuat data... </span> : null}

          {Object.entries(data).map(([id, components]: [string, any]) => {
            return (
              <div key={id} className="w-100">
                <br />
                <Card className="w-100" key={id}>
                  <Card.Header>
                    <Card.Title className="text-center">
                      <span className="fs-3 fw-bold text-dark text-center">
                        { "Section: " + id.charAt(0).toUpperCase() + id.slice(1) }
                      </span>
                    </Card.Title>
                    { success == id && (
                      <div className="alert alert-success text-center py-2" role="alert">
                        Berhasil Memperbaharui Data
                      </div>
                    ) }
                  </Card.Header>
                  <Card.Body>
                    <Card.Text as="div">
                      <form onSubmit={
                        handleSubmit((result) => onSubmit(result, id))
                      }>
                        { loadComponents(components, id) }

                        <div className="text-center">
                          <Button type="submit" disabled={process} className={`btn btn-primary fw-semibold py-2`}>
                            Apply Changes
                          </Button>
                        </div>
                      </form>
                    </Card.Text>
                  </Card.Body>
                </Card>
              </div>
            )
          })}
        </div>
      </div>
    </main>
  )
}