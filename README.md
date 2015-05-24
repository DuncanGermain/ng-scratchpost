# ng-scratchpost 3.0
Scratchpost is a web-based single-page app using Angular and Firebase.  It is designed to supplement lectures and discussions by allowing multiple participants to contribute answers/content to individual sections of a single, projected window.

Concept: Conor Moreton (2009)
Original design: Stephanie Zolayvar (2009)
ver 2.0: scratchpost.herokuapp.com/index.html
2.0 design: Conor Moreton, Matthew McClure, Nathan O'Brien (Jan 2015), with assistance from the staff at CodeFellows
3.0 design: Conor Moreton (May 2015), with assistance from Stephanie Zolayvar

Workflow:
 - The SESSION LEADER initiates a session by creating a session code.
 - A PARTICIPANT joins the session by entering the chosen code and a unique username.
 - For each participant, a window containing that participant's data appears on the session leader's page.
 - The session leader enters a question or prompt, which then appears on each participant's page.
 - The participants enter their responses, which then appear in their respective windows on the main page.
 - The session leader then interacts with those answers as part of the broader lecture or discussion.

Features:
 - Participant windows auto-resize based upon the number of participants
 - Participant windows may be dragged, deleted, or edited by the session leader
 - Participant responses can be fully anonymous using the "hide names" feature (participant windows reshuffle position automatically with each new question)
 - Participants can be limited to a single response, or allowed infinite resubmissions (e.g. quiz response vs. continual feedback during a lecture)
 - Participants' answers can be hidden either during or after submission (e.g. if an instructor wants to reveal all answers at once rather than letting the stragglers look at/use the first responses to be submitted)
 - PDF printout of current state at any time (current prompt, and a list of {user: response} pairs) to "save" data

