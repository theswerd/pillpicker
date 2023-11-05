from easyfsl.methods import PrototypicalNetworks, FewShotClassifier
from easyfsl.modules import resnet12
import torch
from PIL import Image
from torchvision import transforms
from torch import Tensor
import numpy as np
import pandas as pd
from fastapi import FastAPI
from io import BytesIO
import base64
from base64 import b64decode


app = FastAPI()

convolutional_network = resnet12()
few_shot_classifier = PrototypicalNetworks(convolutional_network)
# load model.pt
few_shot_classifier.load_state_dict(torch.load("./model_final.pt", map_location="cpu"))

image_size = 84
IMAGENET_NORMALIZATION = {"mean": [0.485, 0.456, 0.406], "std": [0.229, 0.224, 0.225]}
transform = transforms.Compose(
            [
                transforms.Resize([int(image_size * 1.15), int(image_size * 1.15)]),
                transforms.CenterCrop(image_size),
                transforms.ToTensor(),
                transforms.Normalize(**IMAGENET_NORMALIZATION),

            ]
        )


def get_features(img):
    img = transform(img)
    features = few_shot_classifier.compute_features(img.unsqueeze(0))
    return features.cpu().detach().numpy().tolist()[0]


from pydantic import BaseModel


class Item(BaseModel):
    img: str

@app.post("/")
async def root(item: Item):
    print("RECIEVED IMG", item.img)
    img = Image.open(BytesIO(base64.b64decode(item.img.replace("data:image/jpeg;base64,", ""))))
    return get_features(img)
