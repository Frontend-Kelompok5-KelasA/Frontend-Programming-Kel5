"use client";

import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Button, Card } from "react-bootstrap";
import { upload } from "@vercel/blob/client";

export default function EditRestoById() {
  const { id } = useParams();

  const [data, setData] = useState({});

  const [process, setProcess] = useState<boolean>(false);

  const { register, handleSubmit, reset } = useForm({
    defaultValues: structuredClone(data),
  });

  const [success, setSuccess] = useState(false);

  const onSubmit = async (result: any) => {
    setProcess(true);

    if (!result.image[0]) return;

    const file = result.image[0];

    const blob = await upload(`uploads/${Date.now()}-${file.name}`, file, {
      access: "public",
      handleUploadUrl: "/api/vercel-blob",
    });

    let cloned = structuredClone(result);
    // @ts-ignore
    cloned.image = blob.url;

    await fetch(`/api/resto/${id}`, {
      method: "POST",
      body: JSON.stringify({ restoData: cloned }),
    });

    setSuccess(true);
    setProcess(false);
  };

  const formatName = (name: string) => {
    const formatted = name
      .replace("cat", "category")
      .replace("officialWebsite", "official Website")
      .replace("openHour", "open Hour");
    return formatted.slice(0, 1).toUpperCase() + formatted.slice(1);
  };

  useEffect(() => {
    const retrieveData = async () => {
      const response = await fetch("/api/resto", { method: "GET" });
      const data = await response.json();

      let result = null;
      data.forEach((e: any) => {
        if (e.id === id) {
          result = e;
        }
      });

      setData(result ?? {});
    };

    retrieveData();
  }, []);

  return (
    <main className="container d-flex flex-column justify-content-center align-items-center py-4 min-vh-100">
      <Card className="w-100">
        <Card.Header>
          <Card.Title>
            <h2 className="fw-bold fs-3 text-center"> Edit Restaurant </h2>
          </Card.Title>
          <Card.Subtitle>
            <h2 className="fw-semibold fs-5 text-center"> (ID: {id}) </h2>
          </Card.Subtitle>
        </Card.Header>
        <Card.Body>
          {success && (
            <div className="alert alert-success text-center py-2" role="alert">
              Berhasil Memperbaharui Data
            </div>
          )}
          <form onSubmit={handleSubmit((result) => onSubmit(result))}>
            {Object.entries(data).map(([name, val]: [string, any]) => {
              if (name === "desc" || name === "id") return null;

              return (
                <div key={name} className="mb-3">
                  <span className="form-label"> {formatName(name)} </span>
                  {name === "image" ? (
                    <input
                      type="file"
                      accept="image/*"
                      required
                      className="form-control"
                      // @ts-ignore
                      {...register(name as any)}
                    />
                  ) : (
                    <input
                      type="text"
                      required
                      defaultValue={val}
                      className="form-control"
                      // @ts-ignore
                      {...register(name as any)}
                    />
                  )}
                </div>
              );
            })}

            <div className="d-grid mt-4">
              <Button type="submit" disabled={process} className="btn-tambah">
                Apply Changes
              </Button>
            </div>
          </form>
        </Card.Body>
      </Card>
    </main>
  );
}
