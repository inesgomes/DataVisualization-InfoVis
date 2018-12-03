import pandas as pd

files = ["assault", "burglary", "homicide", "robbery", "sexualviolence"]

for i in range(0, len(files)):
    df = pd.read_csv("raw/" + files[i] + ".csv", sep=';', decimal='.')
    # create json
    info = df.to_json(orient="records")
    json = files[0] + " = { \"countries\": " + info + " }"
    # write to file
    with open("../data/"+files[i]+".js", "w") as text_file:
        print(json, file=text_file)