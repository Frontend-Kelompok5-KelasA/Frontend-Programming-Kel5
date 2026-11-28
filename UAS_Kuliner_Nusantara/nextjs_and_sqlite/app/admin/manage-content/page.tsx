"use client";

import {useEffect, useRef, useState} from "react";
import {redirect} from "next/navigation";
import {Button} from "react-bootstrap";
import {loadSession} from "@/script/utils";

export default function ManageContent(){
  const table = useRef(null);
  const [pages, setPages] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [process, setProcess] = useState(false);

  useEffect(() => {
    const load = async() => {
      const res = await fetch('/api/config', { method: 'GET' });
      if (!res.ok)return;

      const pages = (await res.json())["pages"];

      setLoaded(true);
      setPages(pages);
    }

    loadSession();

    load();
  }, []);
  
  return (
    <main>
      <section className="halaman-tabel">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h1 className="mb-0">Manage Page</h1>
        </div>

        <div className="table-wrap"
             style={{ overflowY: 'hidden', height: 'auto', maxHeight: 'none', borderRadius: 0 }}
        >
          <table className="table table-bordered table-striped table-hover align-middle mb-0">
            <thead>
              <tr>
                <th scope="col">No</th>
                <th scope="col">Nama Page</th>
                <th scope="col">Edit</th>
              </tr>
            </thead>

            <tbody ref={table}>
              { !loaded ? (<tr>
                <td colSpan={8} className="text-center">Loading data...</td>
              </tr>) : null }

              { pages.map((pageId: string, i: number) => {
                return (
                  <tr key={pageId}>
                    <td> {i + 1} </td>
                    <td> {pageId.slice(0, 1).toUpperCase() + pageId.slice(1)} </td>
                    <td>
                      <Button onClick={() => {
                        setProcess(true);
                        redirect(`/admin/manage-content/${pageId}`);
                      }} disabled={process}>
                        Edit Page
                      </Button>
                    </td>
                  </tr>
                )
              }) }
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}
