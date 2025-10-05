### API Overview
- Base URL : https://what-are-we-cooking.onrender.com
- Auth: None
- Content types: multipart/form-data (upload), application/json (responses)
- Flow: Frontend uploads a CSV → backend processes synchronously → backend returns JSON with download URL → frontend waits ~6s → frontend downloads using provided URL.

### Endpoints

#### 1 POST /upload-file/
- Purpose: Upload a CSV for processing. Returns the download URL of the processed file.
- Request
  - Headers: 
    - Content-Type: multipart/form-data
    - Accept: application/json
  - Body (form-data):
    - file: File (CSV)
- Response 200 (application/json):
  - downloadUrl: string — absolute or relative URL to GET for the processed file, e.g. "/download/test_result.csv/"
  - filename: string — the processed file name, e.g. "test_result.csv"
- Response 400 (application/json):
  - error: string — description of what went wrong (missing file, parse error, model error, etc.)
- Notes for frontend:
  - After receiving 200, wait ~6 seconds, then request downloadUrl.
  - The backend only returns the URL when processing is complete; a delay is purely for UX.
  - If you want to ensure the file exists before downloading, optionally do a HEAD or GET with no-cache and check for 200.

Example (curl):
```bash
curl -X POST "{base_url}/upload-file/" \
  -H "Accept: application/json" \
  -H "Content-Type: multipart/form-data" \
  -F "file=@/path/to/your.csv"
# -> {"downloadUrl":"/download/your_result.csv/","filename":"your_result.csv"}
```

Expected success JSON:
```json
{
  "downloadUrl": "/download/your_result.csv/",
  "filename": "your_result.csv"
}
```

#### 2 GET /download/{filename}/
- Purpose: Download the processed CSV.
- Path params:
  - filename: string — returned by POST /upload-file/ (e.g., "your_result.csv")
- Response 200 (file/octet-stream):
  - Content-Disposition: attachment; filename="{filename}"
  - Body: CSV file bytes
- Response 404 (application/json):
  - detail: "File not found"
- Notes for frontend:
  - Use the exact URL returned by upload. It’s safe to request directly after the ~6s delay.
  - Use a normal browser navigation, anchor download, or programmatic fetch+blob save (if SPA).

Example (curl):
```bash
curl -X GET "{base_url}/download/your_result.csv/" --output your_result.csv
```

### File Requirements
- Input file type: CSV
- Columns: Must match the model’s expected schema (the backend reads the CSV and runs predictions)
- Size limits: Not enforced here; the frontend should avoid extremely large files, or introduce UI validation.

### Frontend Integration Notes
- Suggested flow:
  1) User selects CSV
  2) Upload via POST /upload-file/
  3) If 200, show success UI + spinner
  4) Wait ~6 seconds (setTimeout)
  5) Trigger download via GET using the returned downloadUrl
- Robustness:
  - Implement error handling for non-200 from upload; show error message
  - Optional preflight: before downloading, call HEAD downloadUrl and proceed only if 200
  - Disable double submissions while a request is in-flight

### Error Handling (common cases)
- 400 Bad Request: malformed CSV, missing file field, or model dependency errors
- 404 Not Found: download requested for a file that doesn’t exist
- 500 Internal Server Error: unexpected errors; the response will not leak details

### CORS
- If frontend runs on a different origin, ensure CORS is enabled on the backend (e.g., allow the frontend origin/methods/headers). The download as a browser navigation typically avoids CORS issues.

### Example UX copy
- On upload success: “Your file is being prepared. Download starts shortly…”
- On download failure: “We couldn’t fetch your result. Try again or re-upload.”