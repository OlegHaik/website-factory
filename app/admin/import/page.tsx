"use client"

import { useState, useRef } from "react"
import { ExternalLink, UploadCloud, CheckCircle2, AlertCircle } from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface ImportError {
  row: number
  message: string
  slug?: string
  domain_url?: string
}

interface ImportResponse {
  success?: boolean
  imported?: number
  slugs?: string[]
  errors?: ImportError[]
  message?: string
}

export default function AdminImportPage() {
  const [fileName, setFileName] = useState<string>("")
  const [isUploading, setIsUploading] = useState(false)
  const [result, setResult] = useState<ImportResponse | null>(null)
  const [error, setError] = useState<string>("")
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  async function handleUpload() {
    if (!fileInputRef.current?.files?.[0]) return
    setIsUploading(true)
    setError("")
    setResult(null)

    const file = fileInputRef.current.files[0]
    try {
      const text = await file.text()
      const resp = await fetch("/api/import-sites", {
        method: "POST",
        headers: {
          "Content-Type": "text/csv",
        },
        body: text,
      })

      const json = (await resp.json()) as ImportResponse
      if (!resp.ok) {
        setError(json?.message || "Upload failed")
      }
      setResult(json)
    } catch (err) {
      setError((err as Error).message || "Unexpected error")
    } finally {
      setIsUploading(false)
    }
  }

  function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    setResult(null)
    setError("")
    if (!file) {
      setFileName("")
      return
    }
    if (!file.name.toLowerCase().endsWith(".csv")) {
      setError("Please select a .csv file")
      setFileName("")
      return
    }
    setFileName(file.name)
  }

  return (
    <div className="min-h-screen bg-white py-12">
      <div className="container mx-auto px-4 max-w-5xl space-y-8">
        <header className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Admin</p>
          <h1 className="text-3xl font-bold text-slate-900">Website Factory - Import Sites</h1>
          <p className="text-sm text-slate-600">
            Upload a CSV to create or update sites without using curl or Postman.
          </p>
        </header>

        <Card className="border-slate-200">
          <CardHeader>
            <CardTitle className="text-xl text-slate-900">Instructions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-slate-700">
            <p className="text-slate-700">
              Required columns: <strong>slug</strong>, <strong>business_name</strong>, <strong>domain_url</strong>,
              <strong> city</strong>, <strong>state</strong>, <strong>phone</strong>, <strong>category</strong>,
              <strong> is_main</strong>. Optional: <strong>email</strong>, <strong>address</strong>, <strong>zip_code</strong>,
              <strong> owner</strong>, <strong>style_id</strong>, <strong>service_areas</strong>.
            </p>
            <p className="text-slate-700">
              Tip: set <strong>is_main=true</strong> for the primary domain row, and <strong>false</strong> for related
              service-area rows.
            </p>
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 font-mono text-xs text-slate-800 overflow-x-auto">
              <div>slug,business_name,domain_url,city,state,phone,category,is_main</div>
              <div>jersey-city,Jersey Mold Co,example.com,Jersey City,NJ,(555) 123-4567,mold_remediation,true</div>
              <div>hoboken,Jersey Mold Co,example.com,Hoboken,NJ,(555) 123-4567,mold_remediation,false</div>
            </div>
            <a
              className="inline-flex items-center gap-2 text-emerald-600 hover:text-emerald-700 text-sm font-semibold"
              href="/templates/sites-template.csv"
              download
            >
              <ExternalLink className="h-4 w-4" /> Download CSV template
            </a>
          </CardContent>
        </Card>

        <Card className="border-slate-200">
          <CardHeader>
            <CardTitle className="text-xl text-slate-900">Upload CSV</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <label className="flex flex-1 cursor-pointer items-center justify-between rounded-lg border-2 border-dashed border-slate-200 px-4 py-3 hover:border-emerald-400">
                <div className="flex items-center gap-3 text-slate-700">
                  <UploadCloud className="h-5 w-5 text-emerald-500" />
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold">Choose CSV file</span>
                    <span className="text-xs text-slate-500">Only .csv files are accepted</span>
                  </div>
                </div>
                <span className="text-xs font-medium text-slate-600 truncate max-w-[40%] text-right">
                  {fileName || "No file selected"}
                </span>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".csv,text/csv"
                  className="hidden"
                  onChange={onFileChange}
                />
              </label>
              <Button
                onClick={handleUpload}
                disabled={!fileName || isUploading}
                className="w-full sm:w-auto"
              >
                {isUploading ? "Uploading..." : "Upload"}
              </Button>
            </div>
            {error ? (
              <div className="flex items-center gap-2 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                <AlertCircle className="h-4 w-4" />
                <span>{error}</span>
              </div>
            ) : null}
            {result ? (
              <div className="space-y-3">
                {result.success ? (
                  <div className="flex items-center gap-2 rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
                    <CheckCircle2 className="h-4 w-4" />
                    <span>
                      Imported {result.imported ?? 0} row{(result.imported ?? 0) === 1 ? "" : "s"}.
                    </span>
                  </div>
                ) : null}
                {result.slugs?.length ? (
                  <div className="text-xs text-slate-700">
                    <span className="font-semibold text-slate-900">Slugs:</span> {result.slugs.join(", ")}
                  </div>
                ) : null}
                {result.errors?.length ? (
                  <div className="overflow-x-auto rounded-lg border border-slate-200">
                    <table className="min-w-full text-left text-sm">
                      <thead className="bg-slate-50 text-slate-700">
                        <tr>
                          <th className="px-3 py-2 font-semibold">Row</th>
                          <th className="px-3 py-2 font-semibold">Slug</th>
                          <th className="px-3 py-2 font-semibold">Domain</th>
                          <th className="px-3 py-2 font-semibold">Status</th>
                          <th className="px-3 py-2 font-semibold">Message</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {result.errors.map((err, idx) => (
                          <tr key={`${err.row}-${idx}`}>
                            <td className="px-3 py-2 text-slate-700">{err.row}</td>
                            <td className="px-3 py-2 text-slate-700">{err.slug || "—"}</td>
                            <td className="px-3 py-2 text-slate-700">{err.domain_url || "—"}</td>
                            <td className="px-3 py-2 text-red-600 font-semibold">Error</td>
                            <td className="px-3 py-2 text-slate-700">{err.message}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : null}
              </div>
            ) : null}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
