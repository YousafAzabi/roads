## Synopsis

The direction of traffic for oneway roads can change, leading to out-of-date online data. The current process for detecting these changes in direction is a manual approach, including trawling through newspaper extracts and through word of mouth from local authorities to see which roads have changed. This results in a slow, time-consuming update process where the majority of surveyors will be sent to random locations in order to determine if the directions are still valid, most of which will already be correct. There is a clear need for a better suited detection system, to avoid the waste of time in sending surveyors to locations where the directions of roads are likely already correct.

## Proposal

An automated solution should be produced in order to minimize the amount of redundant checks surveyors will have to perform. One proposal for this is to have a system that will compare the OS Road Data with Road Data from other Map companies such as OpenStreetMap. This system should be able to detect any differences in the direction of a given road, and will flag these roads as an area of interest, giving surveyors a more relevant, and less random, list of roads that should be checked.

### Problems

There are several major obstacles involved in this project that need to be considered and overcome before the end product can be functional. These include:

- A way to identify the same road in both the OS Data and other third party data. In each Database, each road is given a unique ID to identify it, however this ID will be different in each data source, and so a method to detect which objects represent the same road must be implemented.

- A way to give each road a physical value for "direction", this must be calculated somehow through the coordinates of the road. The value assigned for a direction must also be considered, ie. should it be a bearing (270deg, NW, SE) or a pointer (left, right).

- If a change is detected, how are these areas of interest dealt with? Are they added to a new database? Displayed in an app?

- If a change in a road is detected, how are we going to make sure that this road isn't flagged again on future checks?

## Requirements

The system **must:**
- Identify the same road between two different data sets.
- Assign each road a "direction" attribute and value calculated from its coordinates.
- Compare the direction attribute between identical roads, and flag and deal with any roads that have a difference in direction.
- Display/store roads that have been flagged so that surveyors can have access to them.
