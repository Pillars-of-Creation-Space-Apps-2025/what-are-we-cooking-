import os
from fastapi import FastAPI, UploadFile, File, HTTPException, status
from fastapi.responses import FileResponse, JSONResponse
from .services import process_file

app = FastAPI()

@app.post("/upload-file/")
async def upload_file(file: UploadFile = File(...)):
    try:
        results = await process_file(file)
        return JSONResponse(content={"results": results})
    except Exception as e:
        return JSONResponse(status_code = status.HTTP_400_BAD_REQUEST, content = {"error": str(e)})

@app.get("/download/{filename}/")
async def download_file(filename: str):
    results_dir = os.path.join(os.path.dirname(__file__), "..", "results")
    file_path = os.path.join(results_dir, filename)

    if not os.path.exists(file_path):
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="File not found")

    return FileResponse(file_path, media_type="application/octet-stream", filename=filename)
