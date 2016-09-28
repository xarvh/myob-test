This is a code test I have been asked to do as part of a job opening.
This readme contains my development notes and, at the end, the original test spec.


SETUP & USAGE
---------------

The tool is written for Node 6.
Dependencies can be installed normally with `npm install` from the repo directory.

The tool can be invoked normally from the command line:
```
main.js JSON_INPUT_FILE
```



NOTES
-----

The main problem with the spec is with the input dates.
The spec defines only a "payment start date", but all the examples seem to require the user to specify both start and end date.

What I would normally do would be to get to whoever wrote the spec and have a nice long conversation about what is exactly that they want.

Further, the spec describes only the case where the period covers exactly one calendar month, so the above conversation should also
determine whether this is the only case to be covered.
If any possible date interval can be defined, then more information on how to calculate daily and hourly rates will be needed.
Also, it may be worth to ask if a larger interval should be broken in calendar months or processed as a single block.

The examples provide dates without an explicit year.
There is NFW I will allow accounting data to not specify the year in a date, it is not a context where ambiguity is tolerable.

The examples specifies the dates as a single field, where the two dates are separed by a hyphen.
To remove any ambiguity, the implementation assumes that two dates are provided independently.



TEST SPECS
==========


> Please complete the exercise below using Node.js, Java, Scala or Clojure and send us your solution.
> We perform these tests to get a feel for how you approach problems, how you think, and how you design your code.
> Thank you and have fun.
> ----------------------------------------------------------------------------------
> 
> Problem: Employee monthly payslip
> 
> When I input the employee's details: first name, last name, annual salary(positive integer) and super rate(0% - 50% inclusive), payment start date, the program should generate payslip information with name, pay period,  gross income, income tax, net income and super.
> 
> The calculation details will be the following:
> •       pay period = per calendar month
> •       gross income = annual salary / 12 months
> •       income tax = based on the tax table provide below
> •       net income = gross income - income tax
> •       super = gross income x super rate
> 
> Notes: All calculation results should be rounded to the whole dollar. If >= 50 cents round up to the next dollar increment, otherwise round down.
> 
> 
> The following rates for 2012-13 apply from 1 July 2012.
> 
> Taxable income   Tax on this income
> 0 - $18,200     Nil
> $18,201 - $37,000       19c for each $1 over $18,200
> $37,001 - $80,000       $3,572 plus 32.5c for each $1 over $37,000
> $80,001 - $180,000      $17,547 plus 37c for each $1 over $80,000
> $180,001 and over       $54,547 plus 45c for each $1 over $180,000
> 
> The tax table is from ATO:  https://www.ato.gov.au/rates/individual-income-tax-rates/
> 
> 
> Example Data
> Employee annual salary is 60,050, super rate is 9%, how much will this employee be paid for the month of March ?
> •       pay period = Month of March (01 March to 31 March)
> •       gross income = 60,050 / 12 = 5,004.16666667 (round down) = 5,004
> •       income tax = (3,572 + (60,050 - 37,000) x 0.325) / 12  = 921.9375 (round up) = 922
> •       net income = 5,004 - 922 = 4,082
> •       super = 5,004 x 9% = 450.36 (round down) = 450
> 
> Here is the csv input and output format we provide. (But feel free to use any format you want)
> 
> Input (first name, last name, annual salary, super rate (%), payment start date):
> David,Rudd,60050,9%,01 March – 31 March
> Ryan,Chen,120000,10%,01 March – 31 March
> 
> Output (name, pay period, gross income, income tax, net income, super):
> David Rudd,01 March – 31 March,5004,922,4082,450
> Ryan Chen,01 March – 31 March,10000,2696,7304,1000
> 
> As part of your solution:
> •       List any assumptions that you have made in order to solve this problem.
> •       Provide instructions on how to run the application
> •       Provide a test harness to validate your solution.

