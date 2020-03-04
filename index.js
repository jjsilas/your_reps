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
    .then(response => response.json())
    .then(responseJson => render(responseJson));
}
function render(data) {
  const members = data.results[0].members
  const html = members.map(member => `
  <tr>
    <td>${member.first_name} ${member.last_name}</td>
    <td>${member.total_votes} (missed ${member.missed_votes})</td> 
      <td> <button type="button" onClick="getVotes('${member.id}')"> getVotes </button> </td>
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
function renderVotes(data) {
  let html=""
  if (data.num_results == 0) {
    html = `<tr>
    <td colspan="3"> Details were not found for this Cogress Person Representatives in the API even through they may have some unlisted votes.</td>
    </tr>`
 

  } else {

    const votes = data.results
    html = votes.map(vote => `
  <tr>
    <td>${vote.date}</td>
    <td>${vote.text}</td> 
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