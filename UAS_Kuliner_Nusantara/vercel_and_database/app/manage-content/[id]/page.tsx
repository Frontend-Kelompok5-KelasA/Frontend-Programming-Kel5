"use client";

import React, {useEffect, useState} from "react";
import {Card} from "react-bootstrap";
import {useForm} from "react-hook-form";
import {useParams} from "next/navigation";

export default function ManageContentById(){
  const params: {id: string} = useParams();

  const [data, setData] = useState({});

  const { register, handleSubmit, reset } = useForm({defaultValues: structuredClone(data)});

  const [success, setSuccess] = useState("");

  const onSubmit = async (result: any, id: string) => {
    let cloned = structuredClone(data);
    // @ts-ignore
    cloned[id] = result[id];

    setData(cloned);

    await fetch(`/api/config/${params.id}`, { method: "POST", body: JSON.stringify({ pageData: cloned }) });

    setSuccess(id);
  };

  const propertyIdToName = (id: string) => {
    return id.replace("src", "Image URL").replace("alt", "Alt Text");
  }

  const loadProperties = (properties: any, pathId: string) => {
    const isMultiple = Object.entries(properties).length > 1;
    return Object.entries(properties).map(([propertyId, propertyData]: [string, any]) => {
      return (
        <div key={propertyId} className="text-start">
          {isMultiple ? <div> <span> {propertyIdToName(propertyId)} </span> <br /> </div> : null}
          <input type="text"
                 required
                 defaultValue={propertyData}
                 className="col-10"
            // @ts-ignore
                 {...register((pathId + "." + propertyId) as any)}
          />
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
          return  Object.entries(inner).map(([id, data]: [string, any]) => {
            if(id === "id")return null;
            return(
              <div key={id}>
                <span className="fs-5"> {id.charAt(0).toUpperCase() + id.slice(1)} </span>
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
          <span className="fs-4">
            { compId.charAt(0).toUpperCase() + compId.slice(1) }
          </span>
          <br />
          { Array.isArray(compData) ? loadInnerComponent(compData, sectionId + "." + compId)
            : loadProperties(compData, sectionId + "." + compId) }
          <br />
        </div>
      );
    });
  };

  useEffect(() => {
    const retrieveData = async() => {
      const res = await fetch(`/api/config/${params.id}`);

      const { config } = await res.json();
      if(!config)return;

      setData(config);
    }

    retrieveData();
  }, [params.id, reset]);

  return (
    <main>
      <div className="main-container">
        <div className="d-flex flex-column justify-content-center align-items-center">
          {Object.entries(data).map(([id, components]: [string, any]) => {
            return (
              <div key={id} className="w-100 d-flex flex-column align-items-center justify-content-center">
                <br />
                <Card className="w-50" key={id}>
                  <Card.Body>
                    <Card.Title>
                      <span className="fs-3 fw-bold text-dark">{ id.charAt(0).toUpperCase() + id.slice(1) }</span>
                    </Card.Title>
                    <Card.Text as="div">
                      <form onSubmit={
                        handleSubmit((result) => onSubmit(result, id))
                      }>
                        { loadComponents(components, id) }
                        <button type="submit" id="submit" className="fs-5"> Apply </button>
                        { success == id ? <div> <br /> <span className="text-success"> Berhasil memperbaharui data </span> </div> : null }
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