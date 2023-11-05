from easyfsl.methods import PrototypicalNetworks, FewShotClassifier
from easyfsl.modules import resnet12
import torch
from PIL import Image
from torchvision import transforms
from torch import Tensor
import numpy as np

import pandas as pd
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
# read extract-350.json
photos = pd.read_json("./extract-350.json")
new_photos = []
print(photos)
for index, row in photos.iterrows():
    try:
        img = Image.open(f"../data/data/training/{str(row.get('id')).rjust(11, '0')}/0.JPG").convert("RGB")
    except:
        try:
            img = Image.open(f"../data/data/training/{str(row.get('id')).rjust(11, '0')}/1.jpg").convert("RGB")
        except:
            try:
                img = Image.open(f"../data/data/training/{str(row.get('id')).rjust(11, '0')}/2.jpg").convert("RGB")
            except:
                continue
    
    img = transform(img)
    features = few_shot_classifier.compute_features(img.unsqueeze(0))
    print(index , "/", len(photos),)
    print(features.shape)
    new_photos.append({
        "id": row.get("id"),
        "features": features.tolist()
    })


new_photos = pd.DataFrame(new_photos)
new_photos.to_json("./extract-350-features-final.json")
    
    

# # load test_img.jpg
# image = Image.open("test_img.jpg").convert("RGB")
# other_image = Image.open("test_img_2.jpg")
# other_pill = Image.open("other_pill.jpg")

# other_pill_2 = Image.open("other_pill_2.jpg")
# other_pill_4 = Image.open("other_pill_4.jpg")
# # tensorize

# image = transform(image)

# # wrap tensor in tensor
# # wrap in array
# features = few_shot_classifier.compute_features(image.unsqueeze(0))
# print("features", features)
# tensor_data = [[1, 2, 3], [4, 5, 6], [7, 8, 9]]
# two_d_tensor = torch.tensor(tensor_data, dtype=torch.float32)
# distance = few_shot_classifier.l2_distance_to_prototypes(two_d_tensor)

# print(distance)