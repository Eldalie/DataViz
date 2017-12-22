Add a README file that explains the technical setup and intented usage

# The Evolution of Rock

This is a project for the Data Visualization course at EPFL. It uses data from the Million Song dataset to describe the evolution of the rock style of music over time.

The result of this project can be viewed on the following website:
[Evolution of Rock](https://gandalfatepfl.github.io/DataViz)

## Technical setup

This github repository contains all the work related to the project. In order to see the result, see the link above.

GitHub repo structure:

  - Data: the data and all the scripts related to it, along with description, are in the /data folder
  - Code: all the code and related files are in the source folder /src.
  - Other files and documents: images used for the process book are stored in /images folder, the process book itself is in the root both in markdown and pdf verions.

## Intended usage

This repository provides the link to the website which is the main point of usage. On that website one can find the story and the idea of our project and visualization, together with the presentation video and the visualization itself.

### Visualization description and usage
  
  The link for the [visualization](https://gandalfatepfl.github.io/DataViz/map.html) (which can be also found on the website) brings the user to a separate webpage with the following interactive elements:
  
    * The map, which the user can zoom in or zoom out, in order to see the location of songs (artists) filtered by music styles, each having each own color. The maximum zoom allows the user to get more info on the particular song.

    * The streamgraph, which shows the overview of the selected styles, splitted by year. The graph is interactive and the user can get exact numbers for each year and style on hover.

    * The time range selector in years, which is located under the streamgraph, can be used to get the numbers for a specific year (by clicking on it) or a range of years (by draging the sides of the selector). These actions would apply filtering on the map and display only related results.

    * The legend with the selected styles can be used as a filter: clicking on a style with its bubble will delete/add the style from the map and streamgraph.

    * The buttons on the left of the streamgraph will start/pause, stop and change the speed of the demo for the evolution of the rock music: basically the user can see on the map how the numbers change over the years, where the years are changed automatically.

    * Additionally there is an explanation section on the right that provides the user with interesting information and changes for certain years and selections! Explore yourself :)
  




