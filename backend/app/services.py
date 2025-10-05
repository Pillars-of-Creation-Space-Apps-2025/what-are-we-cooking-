import os
import joblib
import pandas as pd
from fastapi import UploadFile
from .utils import save_file


_MODEL = None

def get_model():
    global _MODEL
    if _MODEL is None:
        project_root = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
        model_path = os.path.join(project_root, "model/lr_model.pkl")
        with open(model_path, "rb") as f:
            _MODEL = joblib.load(f)
    return _MODEL


async def process_file(upload_file: UploadFile):
    file_path = await save_file(upload_file)
    data = pd.read_csv(file_path)

    model = get_model()
    preds = model.predict(data)

    out = data.copy()
    out['prediction'] = preds

    results_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), "results")
    os.makedirs(results_dir, exist_ok=True)
    result_file_path = os.path.join(results_dir, upload_file.filename.replace('.csv', '_result.csv'))
    out.to_csv(result_file_path, index=False)

    return result_file_path
