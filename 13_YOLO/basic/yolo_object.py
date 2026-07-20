from ultralytics import YOLO

model = YOLO("yolo11n.pt")

print(model.names)

model(
    "input_object.jpg",
    classes=[0, 2], 
    save=True
)