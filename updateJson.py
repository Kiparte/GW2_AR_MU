import requests
import json
from os.path import exists
from datetime import datetime
import pytz


def saveJson():

    
    jsonDict = dict()
    #The only two lines to change to launch the script with another server.
    #List of server ID can be found here : https://wiki.guildwars2.com/wiki/API:2/worlds 
    #2103 for Augury Rock
    jsonDict["serverName"] = "Augury Rock"
    jsonDict["idWorld"] = 2103

    now = datetime.now(pytz.timezone('Europe/Paris'))
    jsonDict["date"] = now.strftime("%d/%m/%Y")
    jsonDict["time"] = now.strftime("%H:%M:%S")

    year, week_num, day_of_week = now.isocalendar()

    #we make the week change on friday at 8pm
    if (day_of_week == 5 and now.hour >= 20 ) or day_of_week > 5:
        week_num +=1

    URL = "https://api.guildwars2.com/v2/wvw/matches?world=" + str(jsonDict["idWorld"])

    resp = requests.get(URL)

    #Color information
    if resp.json()["worlds"]["red"] == jsonDict["idWorld"]:
        jsonDict["worldColor"]="red"
    elif resp.json()["worlds"]["blue"] == jsonDict["idWorld"]:
        jsonDict["worldColor"]="blue"
    else:
        jsonDict["worldColor"]= "green"

    #count the current skirmish
    if exists("results/results" + str(year) + "_" + str(week_num) + ".json") :
        f = open("results/results" + str(year) + "_" + str(week_num) + ".json", "r")
        currentJson = json.load(f)
        skirmish = len(currentJson) + 1
    else : 
        skirmish = 1
    jsonDict["skirmish"] = skirmish

    #Loops of the different maps infos
    for i in range (0,4):
        mapDict = dict()
        mapName=resp.json()['maps'][i]['type']
        kills = resp.json()['maps'][i]['kills'][jsonDict["worldColor"]]
        mapDict["nbKills"] = kills
        deaths = resp.json()['maps'][i]['deaths'][jsonDict["worldColor"]]
        mapDict["nbDeaths"] = deaths
        mapDict["ratio"] = round(mapDict["nbKills"]/mapDict["nbDeaths"], 3)
        if skirmish == 1:
            mapDict["skirmishKills"] = kills
            mapDict["skirmishDeaths"] = deaths
            mapDict["skirmishRatio"] = round(mapDict["nbKills"]/mapDict["nbDeaths"], 3)
        else :
            oldDeaths = currentJson[skirmish - 2][mapName]["nbDeaths"]
            oldKills = currentJson[skirmish - 2][mapName]["nbKills"]
            mapDict["skirmishKills"] = kills - oldKills
            mapDict["skirmishDeaths"] = deaths-oldDeaths
            if oldDeaths != deaths : #prevents division by 0
                mapDict["skirmishRatio"] = (kills - oldKills) / (deaths-oldDeaths)
            else:
                mapDict["skirmishRatio"] = (kills - oldKills)

        jsonDict[mapName] = mapDict
    #first skirmish we write in an empty file
    if skirmish == 1:
        f = open("results/results" + str(year) + "_" + str(week_num) + ".json","a")
        f.write(json.dumps([jsonDict], indent = 2))
        f.close()

    #other skirmishes we append 
    else :
        f = open("results/results" + str(year) + "_" + str(week_num) + ".json", "r")
        currentJson = json.load(f)
        currentJson.append(jsonDict)
        f.close()
        #pretty ugly
        f = open ("results/results" + str(year) + "_" + str(week_num) + ".json", "w")
        f.write(json.dumps(currentJson, indent = 2))
        f.close()



if __name__ == '__main__':
    saveJson()
    

    