import glob
import os
new_name = "Mukti"
path = "./images/"
for folder in os.listdir(path):
    print(folder)
    for file in os.listdir(folder):
        print(file)
