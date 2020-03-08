//New API Test

'use strict';

const apiKey = 'LUcpaYS4z2SvZUKWDsBRj7M6XrWbpVP5JBWMdAcW'

const searchURL = 'https://api.propublica.org/congress/v1/116/senate/members.json';

function formatQueryParams(params) {
  const queryItems = Object.keys(params)
    .map(key => `${key}=${params[key]}`)
  return queryItems.join('&');
}

function getNews() {
  const params = {
    language: "en",
  };
  const queryString = formatQueryParams(params)
  const url = searchURL + '?' + queryString;


  const options = {
    headers: new Headers({
      "X-Api-Key": apiKey
    })
  };


  


    fetch(url, options)
    .then(response => {
      if (response.status === 500) {
        // Render something to the page.
       
        
        throw new Error(response.statusText);
    }
    .then(responseJson => displayResults(responseJson))
    .catch(err => {
      $('').text(`Something went wrong: ${err.message}`);



        
        
        // Return so that we don't attempt to parse the json

        
        return;
      }
  
      return response.json();
    })
    .then(responseJson => render(responseJson));




}






//Member Search
function render(data) {
  const members = data.results[0].members
  const html = members.map(member => `
  <tr>
    <td>${member.first_name} ${member.last_name} - State ${member.state} - Party (${member.party})</td>
    <td>Total Votes ${member.total_votes} (Missed Votes ${member.missed_votes})</td> 
      <td> <button type="button" onClick="getVotes('${member.id}')"> Vote Details </button> </td>
  </tr>
  `)
  $('#vote').html(html)

}

function watchForm() {
  getNews();
  $('#js-form').submit(event => {
    event.preventDefault();
    getNews();
  });
}

//Member votes
function getVotes(member_id) {

  const url = `https://api.propublica.org/congress/v1/members/${member_id}/explanations/116.json`

  console.log(url);

  const options = {
    headers: new Headers({
      "X-Api-Key": apiKey
    })
  };

  fetch(url, options)
    .then(response => response.json())
    .then(responseJson => renderVotes(responseJson));
}

//Voting details
function renderVotes(data) {
  let html=""
  if (data.num_results == 0) {
    html = `<tr>
    <td colspan="3">The Senator did not provide an documented explanation for missing votes. </td>
    </tr>`

  } else {
    const votes = data.results
    html = votes.map(vote => `
  <tr>
  <td><strong>Name </strong> ${data.display_name} date - ${vote.date}</td>
    <td><strong>Explanation for missing vote/s: </strong><br>   ${vote.text} </td> 
      <td> ${vote.url} </td>
  </tr>
  `)
  }

  html+=`
  <tr>
    <td colspan="3"> 
    <div class="containerVoteExp">
    <form id="js-form"> <button class="button button1" type="submit"> Click for list of Representatives </button>
    </form>
  </div>
    </td>
    </tr>
  `
  $('#vote').html(html)
}

$(watchForm);