# 2023-11-06 Monday, 1h, Online
Attendees: Oni, Chris, Charles
Note taker: Oni

## Problems
* Test are Broken and use mock of express
* Route need to use Controlers
* Route prefix /api/v1/

## Discussion
* Work Flow with issue

## Tasks
### React
![](https://gitlab.com/csy3dawson23-24/520/teams/TeamG13-OniChrisCharles/520-project-oni-chris-charles/-/raw/main/StockBenchmark.png?ref_type=heads)
- Plot Component (list of Tickers)
- - Info
- - Plot
- - Date Display
- - Values
- Search Component
- - Filter / Search
- - Display Component (Name / Info)
- Single Stock Info Component
- - Plot Component
- - Information
- List of Tickers Component
- - Dropdown of all Tickers
- Mobile implementation
### Tests
- Fix Tests
- Add tests
### API
- Document with Swagger

## Images
![](https://cdn.discordapp.com/attachments/1166096642517241916/1171249515165139015/image.png?ex=655bfe1d&is=6549891d&hm=5af2804687bc04359181c43b64bce0ba293ea091e6df9b1e4b74b66c2c3ee617&)
![](https://cdn.discordapp.com/attachments/1166096642517241916/1171251751752564746/image.png?ex=655c0032&is=65498b32&hm=21959d559fcfd87f51fe61459a07d331a95cd4204cad387cf12fa8f0979f6f00&)

# 2023-11-10 Friday, 30min, In Person
Attendees: Oni, Chris, Charles; 
Note taker: Charles

## Problems
* broken tests
* prefix still not being used for api

## Discussion
* controllers added but not used yet
* Search works
* Plotly works, just missing logarithmic scale and displaying more than 2 tickers.
* Optional: add to the tickers route a ranking field (for example the top performing ticker will be rated #1), Drawing lines on graph, % page (highs and lows). 
* Unit tests will be prioritized last, to try and get everything else done first. 

## Tasks
### React
- make the graph be able to display more than 2 tickers
- implement watchlist (filters) which will use cache
- show all data on website load (will be scrollable) 
- implement logarithmic scale 
- make mobile display look good 

## Task Division
- Charles: Work on single page display. Work on displaying plotly, filtered by timeframe. 

- Oni: Will work on Implementing a watchlist (filters) that which will use cache, and showing all data on website load (will be scrollable) 

- Chris: Will work on displaying more than 2 tickers being displayed, and graph css, draw line and mobile display 

## Images
![](https://media.discordapp.net/attachments/1166096642517241916/1172633857053425735/image.png?ex=65610762&is=654e9262&hm=de3d71480e8a2c16c33bed96e3acc50c3cee79ee095c0053ec6e35f6e3ac85d7&=&width=523&height=542)

# 2023-11-12 Sunday, 1h, Online
Attendees: Oni, Chris, Charles

Note taker: Chris

## Problems
- Taking in multiple tickers
- CORS not needed
- Work division
- Unit tests
- Usability of graph on mobile

## Discussion
- Searching tickers is implemented, nothing on click yet
- No state when it is ended. 
- Hamburger menu showing items when clicked
- Linked with the local storage (needs integration)
- Show all the tickers fetched at the start (fetched all at once)
- Followed button requires having the integration to localstorage
- Unnessary component declared for single component rendering of the graph through a redirect
- The commit with the unit tests was [here](https://gitlab.com/csy3dawson23-24/520/teams/TeamG13-OniChrisCharles/520-project-oni-chris-charles/-/blob/eb923b31cd235eb86cc825b0e3e4c04a9d8420d7/server/__tests__/app.test.js)

## Tasks
    1. Implement adding ticker to watchlist
    2. Link watchlist to localstorage
    3. Alert dialogue when adding a ticker to watchlist
    4. Link search list to chart plotly graphs to append tickers to render
    5. Render only part of the list (filter by selected ticker)
    6. Render special info on the side of each chart
    7. Fix unit tests to use spyon & supertest
    8. Mobile css for the graph to be minimally usable on a small screen (scale graph to viewport)

## Extra
- Fetch all tickers incrementally and lazy load the chart information based on 1D
- Add functionality for drawing lines on graph and caching operations
- Display additional information for weather each day
- CSS for desktop and mobile implemented
- Caching information relative to the names of tickers compared on graph together

## Task Division

Chris: Work on displaying 2 tickers

Charles: Get chart to display correct viewport for device, implement a sidebar for additional information for stocks/route information

Oni: Local storage caching for the tickers

# 2023-11-12 Wednesday, 45min, In Person
Attendees: Oni, Chris, Charles

Note taker: Oni

## Tasks
Tests
Check mark if ticker selected
Add ticker to favorite
CSS
Date filters
Performance
- Caching
	- Use headers (zip)
- Favorite
- Fetch only needed data
- Fetch one ticker one at a time (no Promise.All)
- LCP

## Distribution
Oni
- Tests
- CSS
- Fetch only needed data
- Fetch one ticker one at a time (no Promise.All)
- Favorite
- Add ticker to favorite

Chris
- Tests
- CSS
- Check mark
- Caching

Charles
- Tests
- CSS
- Route use controller
- Date filter
- Favorite
- Add ticker to favorite

### For Milestone 2
- Unit Tests
- CSS if needed