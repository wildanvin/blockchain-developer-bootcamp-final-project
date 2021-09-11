I will implement a simple betting dapp. 
The bet can only occur between two people (only two wallets or accounts).

What are you betting on? Prices of crypto (maybe in the future sports and other stuff)
 
Lets say that you believe the price of ETH will be $15000 at the end of the year but your friend says: "you are crazy, it won´t go above $5000 if you are lucky". So after a little bit of discussion you say: "ok lets bet $100 on that" and your friend says "Aaaalright". But instead of using a "traditional" bet you will use a smart contract. 

So, you go to the dapp front end.
Select the asset you want to bet on. 
Select the price you think the asset will go
Select the amount you want to bet and a date in the future.
That will create a smart contract and a url with the smart contract address in it.
You have to send this url to your friend.
Your friend will match the amount you are betting.
When the date comes due you or your friend will have to call the smart contract, it will check the price using chainlink and will send the funds to the winner.

I know that would be better if the smart contract execute itself at the date due and send the funds accordingly, I have read a little and seems that you can do that using ethereum-alarm-clock, but in the sake of KISS, i will try to implement this project without that library first. 
   
It sounds simple now but I am sure there are a lot of things I am not considering.
But i think this is doable in 3 months.



