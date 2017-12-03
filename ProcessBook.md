# Process book - Evolution of Rock Music 

To do in the process book: 

- [On going] Overview, motivation, target audience
- [] Related work and inspiration
- [] Questions: What am I trying to show this my viz?
- [] Dataset: where does it come from, what are you processing steps?
- [] Exploratory data analysis: What viz have you used to gain insights on the data?
- [] Designs: What are the different visualizations you considered? Justify the design decisions you made using the perceptual and design principles.
- [Ongoing] Did you deviate from your initial proposal? (it’s ok)


## Introduction 

*Music.*

Regardless of the context in space or time, this simple word can evoke millions of melodies, rythms, artists that have influenced our lives. Music has followed us for our whole lifes, given shape and embelished our best memories. 

We want to share our enthusiasm with our visualization project "Evolution of Rock Music" that is based on the widely used dataset "Million songs". 

This process book hopefully shed lights into our thought process during the establishment of our visualization, from the choice of the subject to the final touch of the visualization technique used.



## Related work and inspiration 

BENZI BASICALLY 

## Data analysis 

The Million Song Dataset with its abundant and detailed features for each song is such an incredible source for data treatment. In our case, we had to do some a fair bit of data analysis to understand its nature in order to grasp the potential for a visualization.

We will focus on those genres :

    - pop rock
    - blues-rock
    - folk rock
    - indie rock
    - rock
    - psychedelic rock
    - rock 'n roll
    - alternative rock
    - hard rock
    - soft rock



# Design 

Description: Visualization tool to show how rock evolve in time.

```
+------------------------------------------------------------------------------------------------------+-----------------------------+
|                                                                                                      |           TITLE             |
|                                                                                                      |                             |
|                                                                                                      |     SOME TEXTE              |
|                                                                                                      |                             |
|                                                                                                      |                             |
|                                                                                                      |                             |
|                                                                                                      |                             |
|                                                                                                      |                             |
|                                                                                                      |                             |
|                       WORDL MAP : WITH ZOMING,move,each song is a dot with a color                   +-----------------------------+
|                       of his genre                                                                   |                             |
|                                                                                                      |                             |
|                                                                                                      |                             |
|                                                                                                      |                             |
|                                                                                                      |       LEGEND !!             |
|                                                                                                      |                             |
|                                                                                                      |                             |
|                                                                                                      |                             |
|                inportant event                                                                       |                             |
|                                                                                                      |                             |
+--------------------+-------------------------------------------+-------------+-----------------------+-----------------------------+
|                    |                                           |             |                                                     |
|                    |                                           |             |                                                     |
|                    |                                           |             |                                                     |
|                    |                                           |             |         Golden ratio                                |
|                    |                                           |             |                                                     |
|                    |                                           |             |                                                     |
|                    |                                           |             |                                                     |
|                    |     SELECT TIME    +       STREAM GRAPH   |             |                                                     |
|                    |                                           |             |                                                     |
|                    |                                           |             |                                                     |
|                    |                                           |             |                                                     |
|                    |                                           |             |                                                     |
|                    |                                           |             |                                                     |
|                    |                                           |             |                                                     |
|                    |                                           |             |                                                     |
|                    |                                           |             |                                                     |
+--------------------+-------------------------------------------+-------------+-----------------------------------------------------+
                                                               start          END

```

## A slow start.. for the best ! 

Initially, we wanted to show the evolution of all types of music thoughout the past century in the world in order to understand the different eras of music by country. The idea was to highlight the evolution of one or two features of a song (e.g. hotness,danceability) by country in time. 
As a visualization we had the intention to use a 2D scatter plot with a slider to navigate in time.  [See example](https://youtu.be/jbkSRLYSojo?t=32s)

We tought that the subject was too wide and not specific enough to convey a clear enough message to the viewer. The scatter plot is a bit simplistic as a visualization method and also difficult to interpret so we decided to have more meaningful approach with the map and the streamgraph. 

