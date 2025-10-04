import os

import pandas as pd
from fastapi import UploadFile
from .utils import save_file
# from themodel import make_prediction


async def process_file(upload_file: UploadFile):
    file_path = await save_file(upload_file)

    data = pd.read_csv(file_path)

    # prediction = make_prediction(data)
    # For now, create a simple result with the original data plus a status column
    data['status'] = 'processed'
    prediction = data

    results_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), "results")
    os.makedirs(results_dir, exist_ok=True)
    result_file_path = os.path.join(results_dir, upload_file.filename.replace('.csv', '_result.csv'))
    pd.DataFrame(prediction).to_csv(result_file_path, index=False)

    return result_file_path
