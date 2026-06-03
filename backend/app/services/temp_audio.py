import os
from tempfile import NamedTemporaryFile

from fastapi import UploadFile


class TempAudioPair:
    def __init__(self) -> None:
        input_temp = NamedTemporaryFile(delete=False, suffix=".mp3")
        output_temp = NamedTemporaryFile(delete=False, suffix=".mp3")
        self.input_path = input_temp.name
        self.output_path = output_temp.name
        self.keep_output = False
        input_temp.close()
        output_temp.close()

    async def write_upload(self, file: UploadFile) -> None:
        with open(self.input_path, "wb") as target:
            target.write(await file.read())

    def cleanup(self) -> None:
        if os.path.exists(self.input_path):
            os.remove(self.input_path)
        if not self.keep_output and os.path.exists(self.output_path):
            os.remove(self.output_path)
