# leagueImpacts
*A tool to study League of Legends games statistics*

##Lexicon
**Win Rate**   
How likely a champion is to win a game.

**Ban Rate**  
How likely a champion is to be banned from a game.

**Play Rate**  
How likely a champion is to be in a game.

**Pick Rate**  
How likely a champion is to be picked in a game when he is not banned.

**Impact**  
How much does a champion impact the average win rate of the game.  
- *positive impact*: the champion is played a lot and wins often.
- *negative impact*: the champion is played a lot but loses often.
- *neutral impact*: the champion is never played or is played but wins as much as he loses.

**Visible impact**    
Impact of a champion considering how likely he is to be in a game.

**True impact**  
Impact of a champion considering how likely he is to be picked in a game when he is not banned.

##Formula
**Win Rate**  
- <img src="http://i.imgur.com/PK3XH8X.png" height="20" />

**Ban Rate**  
- <img src="http://i.imgur.com/FvzUgbY.png" height="20" />  
- <img src="http://i.imgur.com/HoMfIyd.png" height="33" /> 

**Play Rate and Pick Rate**  
- <img src="http://i.imgur.com/vWmzcCd.png" height="20" />  
- <img src="http://i.imgur.com/gGtlmQp.png" height="20" />  
- <img src="http://i.imgur.com/6naL8MY.png" height="48" />  
- <img src="http://i.imgur.com/cNJbNse.png" height="33" />  
- <img src="http://i.imgur.com/68611GK.png" height="33" />  

**Average Win Rate**  
- <img src="http://i.imgur.com/DewpfaB.png" height="48" />  
- <img src="http://i.imgur.com/KJRYzxC.png" height="48" />  

**Impact**  
- <img src="http://i.imgur.com/r8mMryu.png" height="70" /> 
- <img src="http://i.imgur.com/E2w4m9o.png" height="70" /> 
- <img src="http://i.imgur.com/VCgo6NF.png" height="70" /> 


##Definition of the Impact
The impact of a champion is a quantity idincating how much this champion impacts the average win rate of the game.

The *average win rate* of the game is calculated like so:  
<img src="http://i.imgur.com/vWmzcCd.png" height="20" />  
<img src="http://i.imgur.com/Nfjwnga.png" height="120" />  
When calculated with p as the play rate on a good sample of data this average win rate is 50.00%.

The *raw impact* of a champion is defined by the difference between the average win rate of the game and the average win rate of the game without this champion:  
<img src="http://i.imgur.com/cnDVVeB.png" height="128" />  
For instance if the average win rate of the game without Shyvana is 49.2% then her raw impact is 0.008 (=0.500-0.492).

The raw impact is never used like so. We first calculate the *relative impact*:
<img src="http://i.imgur.com/LxBD9w9.png" height="180" />  
This allow us to work on more significant numbers. For instance the relative Impact on Teemo would be 1.6%.

Each game of league of legends count 10 champions. Because of that a champion cannot have a relative impact of more than 1/9. To neglect this effect and allow the Impact to go from -1 to +1 we introduce this new formula for the *Impact*:  
<img src="http://i.imgur.com/r8mMryu.png" height="70" /> 

From this formula defined for 1 champion with a win rate and a pick/play rate we can extrapolate to any hypothetical champion and values of win rate and pick/play rate.

Some values:
- <img src="http://i.imgur.com/PrVh9kb.png" height="25" /> 
- <img src="http://i.imgur.com/dEHESf4.png" height="56" /> 
- <img src="http://i.imgur.com/s6hS3gz.png" height="56" />

The differential equation of the Impact formula allow us to establish this framing:  
<img src="http://i.imgur.com/PrVh9kb.png" height="25" />  
<img src="http://i.imgur.com/OLoycXc.png" height="56" />


##Visible Impact
The *visible impact* is the impact calculated with the play rate of the champions. Using the formula introduced before we can show that:  
<img src="http://i.imgur.com/E2w4m9o.png" height="70" />  
<img src="http://i.imgur.com/Oe01lwO.png" height="25" />  
<img src="http://i.imgur.com/LNGQDXT.png" height="25" />  

The visible impact is the direct observation of the games results. It shows how every champion performed in the game.

##True Impact
The *true impact* is the impact calculated with the pick rate of the champions. Using the formula introduced before and the approximations we can show that:  
<img src="http://i.imgur.com/VCgo6NF.png" height="70" />  
This is an approximation of the result and does not take account of some rare cases. But it's a good estimation in general.

The true impact is a deeper observation of the game than the visible impact. It show how every champion would perform if they weren't banned. For instance a champion with a very high win rate and very high ban rate would have a low visible impact because he would never be available. The true impact of this champion on the other hand would be very high.

The true impact allow us to really show the current meta of the game, not taking in account the ban but really the performance of every champion.


##DataSet
Server-side the champions's data are registered as JSON-objects as follow:  
<code>{"championName":"Volibear","win":0.5341,"picked":0.1143,"banned":0.0475,"games":15017,"date":1464276642561}</code>  
These data represent the stats of a champion during the last 24h in ranked (all queue) on EUW. The "picked" property represent the playrate (not the pickrate). The date represents the timestamp at the moment the data were collected.

A group of data is called a **selection of data**.  
A **dataset** represents the average stats for each champion in a selection of data.
To calcultate the average stats we use the weighted average formula with the number of game as weight.

##Comparing datasets
Comparing datasets allows studying the evolution of the game allong time.  
To mesure the distance between 2 datasets the following formula is proposed:
<img src="http://i.imgur.com/GvtYrnZ.png" height="70" />  
<img src="http://i.imgur.com/RpyCZ8P.png" height="20" />  




