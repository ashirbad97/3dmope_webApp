import asyncio
import csv
from importlib.metadata import requires
import os
import json
import sqlite3
import argparse


# Define the current file path
currentPath = os.getcwd()
# Defning the DB Path
dblocation = os.path.abspath(os.path.join(currentPath, "../db/3dmoper.db"))
print("Database Location is : ", dblocation)
# Function to parse the csv files for stimulus path seeding
def parsecsvfiles(filename):
    # Define JSON File Path
    filepath = os.path.join(currentPath, filename)
    print(filepath)
    coordinatelist = 0
    with open(filepath, "r") as csvfile:
        csvreader = csv.reader(csvfile, delimiter=",")
        for row in csvreader:
            coordinatelist = row
    coordinatelist = json.dumps(coordinatelist)
    return coordinatelist


# Function to parse the csv files for result path seeding
def parsecsvfilesResults(filename):
    # Define JSON File Path
    filepath = os.path.join(currentPath, filename)
    print(filepath)
    coordinatelist = []
    with open(filepath, "r") as csvfile:
        csvreader = csv.reader(csvfile, delimiter=",")
        for row in csvreader:
            coordinatelist.append(row)
    return coordinatelist


# Function to insert the values in the database
def storedb(sessionId, cordId, coordinates):
    try:
        conn = sqlite3.connect(dblocation)
        print("Established connection with database")
        # Define the SQL Query for seeding of Path Coordinates
        # conn.execute("INSERT INTO coordinates (cordId,coordinates) VALUES (?,?)",(cordId,coordinates))
        print("Inside db ")
        print("Initial Coordinate value is ", coordinates.frameTime)
        # print(json.dumps(coordinates.frameTime))
        print("````````````````````````````````````````````````````````````")
        # Define the SQL Query for seeding of Result Coordinates
        conn.execute(
            "INSERT INTO subTrialData\
             (sessionId,subTrialId,frameTime,xCord,yCord,zCord,xLeftGazeDir,yLeftGazeDir,zLeftGazeDir,xRightGazeDir,yRightGazeDir,zRightGazeDir)\
             VALUES (?,?,?,?,?,?,?,?,?,?,?,?)",
            (
                sessionId,
                cordId,
                json.dumps(coordinates.frameTime),
                json.dumps(coordinates.eyePos3Dx),
                json.dumps(coordinates.eyePos3Dy),
                json.dumps(coordinates.eyePos3Dz),
                json.dumps(coordinates.leftGazeDirX),
                json.dumps(coordinates.leftGazeDirY),
                json.dumps(coordinates.leftGazeDirZ),
                json.dumps(coordinates.rightGazeDirX),
                json.dumps(coordinates.rightGazeDirY),
                json.dumps(coordinates.rightGazeDirZ),
            ),
        )

        conn.commit()
    except sqlite3.Error as sqlerror:
        print("An error occoured during the database operation ", sqlerror)
        return False
    except Exception as e:
        print("Sorry something went wrong ", e)
        return False
    else:
        print(
            "The data has been successfully stored in the database for sessionId "
            + str(sessionId)
            + " and subtrialId "
            + cordId
        )
        if coordinates:
            print("Deleting Coordinates")
        del coordinates
        return True
    finally:
        conn.close()


# Function to compute the folder directory of trial .csv file
def findFolder(sessionId, userId):
    currentFolderPath = os.getcwd()
    trialOutputFolder = "../../trialOutput/"
    trialOutputFolderPath = os.path.join(currentFolderPath, trialOutputFolder)
    targetFolder = os.path.join(trialOutputFolderPath, userId, str(sessionId))
    return os.path.abspath(targetFolder)


def dumpToFile(sessionId, subtrial, coordinates):
    try:
        fileExtension = ".json"
        fileName = subtrial + fileExtension
        dumpFolderName = os.path.abspath(os.path.join("../../temp", str(sessionId)))
        print("Checking for dir name : ", dumpFolderName)
        check_dir = os.path.isdir(dumpFolderName)
        print("Check dir found to be ", check_dir)
        if not check_dir:
            print("Dir not found creating new one")
            os.makedirs(dumpFolderName)
        dumpFileName = os.path.join(dumpFolderName, fileName)
        print("Checking for file name : ", dumpFileName)
        check_file = os.path.exists(dumpFileName)
        print("Check file found to be ", check_file)
        if not check_file:
            print("File not found creating new one")
            with open(dumpFileName, "w") as fp:
                pass
        out_file = open(dumpFileName, "w")
        json.dump(json.dumps(coordinates.frameTime), out_file)
        json.dump(json.dumps(coordinates.eyePos3Dx), out_file)
        json.dump(json.dumps(coordinates.eyePos3Dy), out_file)
        json.dump(json.dumps(coordinates.eyePos3Dz), out_file)
        json.dump(json.dumps(coordinates.leftGazeDirX), out_file)
        json.dump(json.dumps(coordinates.leftGazeDirY), out_file)
        json.dump(json.dumps(coordinates.leftGazeDirZ), out_file)
        json.dump(json.dumps(coordinates.rightGazeDirX), out_file)
        json.dump(json.dumps(coordinates.rightGazeDirY), out_file)
        json.dump(json.dumps(coordinates.rightGazeDirZ), out_file)
        out_file.close()
    except Exception as e:
        print("Exception is ", e)


def getCoordinates(filename):
    try:
        coordinates = parsecsvfilesResults(filename)
        # print(coordinates)
        # print(len(coordinates))
        for i in range(1, len(coordinates)):
            # print(coordinates[i][eyePos3DxIndex])
            result.frameTime.append(coordinates[i][result.frameTimeIndex])
            result.eyePos3Dx.append(coordinates[i][result.eyePos3DxIndex])
            result.eyePos3Dy.append(coordinates[i][result.eyePos3DyIndex])
            result.eyePos3Dz.append(coordinates[i][result.eyePos3DzIndex])
            result.leftGazeDirX.append(coordinates[i][result.leftGazeDirXIndex])
            result.leftGazeDirY.append(coordinates[i][result.leftGazeDirYIndex])
            result.leftGazeDirZ.append(coordinates[i][result.leftGazeDirZIndex])
            result.rightGazeDirX.append(coordinates[i][result.rightGazeDirXIndex])
            result.rightGazeDirY.append(coordinates[i][result.rightGazeDirYIndex])
            result.rightGazeDirZ.append(coordinates[i][result.rightGazeDirZIndex])

    except Exception as e:
        print("Error ", e)
    else:
        return result


# Execution Stack for Stimulus Coordinates Seeding
# cordId = "z6"
# filename = "z_pos_fove6.txt"
# coordinates = parsecsvfiles(filename)
# storedb(cordId,coordinates)

# Execution Stack for Result Coordinates Seeding


class ResultCord:
    pass


result = ResultCord()
# Init Indexes
result.frameTimeIndex = 0
result.eyePos3DxIndex = 7
result.eyePos3DyIndex = 8
result.eyePos3DzIndex = 9
result.leftGazeDirXIndex = 1
result.leftGazeDirYIndex = 2
result.leftGazeDirZIndex = 3
result.rightGazeDirXIndex = 4
result.rightGazeDirYIndex = 5
result.rightGazeDirZIndex = 6
# Init Empty List
result.leftGazeDirX = []
result.leftGazeDirY = []
result.leftGazeDirZ = []
result.rightGazeDirX = []
result.rightGazeDirY = []
result.rightGazeDirZ = []
result.frameTime = []
result.eyePos3Dx = []
result.eyePos3Dy = []
result.eyePos3Dz = []

# storedb(subtrialId,result)


def main():
    try:
        # Creating the parser
        parser = argparse.ArgumentParser(
            description="Parsing the subjects trial output csv files and seeding into sqlite3 db"
        )

        # Adding arguments into the parser
        parser.add_argument("-sessionId", type=int, required=True)
        parser.add_argument("-userId", type=str, required=True)
        parser.add_argument("-subtrialId", type=str, required=True)

        # Parse the arguments
        args = parser.parse_args()
        targetFolder = findFolder(args.sessionId, args.userId)
        targetFile = (
            str(args.userId)
            + "_"
            + str(args.sessionId)
            + "_"
            + str(args.subtrialId)
            + ".csv"
        )
        targetFilePath = os.path.abspath(os.path.join(targetFolder, targetFile))
        print(f"File Name is ", targetFilePath)
        stimulus_coordinates = getCoordinates(targetFilePath)
        # dumpToFile(args.sessionId, subtrialId, stimulus_coordinates)
        dbOperation = storedb(args.sessionId, args.subtrialId, stimulus_coordinates)
        print(dbOperation)
    except Exception as e:
        print("Exception is ", e)
        return False
    else:
        return True


if __name__ == "__main__":
    main()
