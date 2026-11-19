---
layout: sesh
title: Survey
nav: survey
heading: Survey
intro: Take a quick survey to give us helpful feedback on our code!
permalink: /sesh/survey
---
<section class="wrap survey">
<h1>Website Prototype Feedback</h1>
<p class="survey__intro">Tell us what you think of our prototype for our website and any feedback!</p>
<p class="survey__note"><span class="req">*</span> Indicates required question</p>
<form id="survey">
  <fieldset class="q">
    <legend>How well do you think our website fits the goals of Sesh?<span class="req" aria-hidden="true"> *</span></legend>
    <label class="opt"><input type="radio" name="fit_goals" value="Very Well" required> <span>Very Well</span></label>
    <label class="opt"><input type="radio" name="fit_goals" value="Somewhat Well" required> <span>Somewhat Well</span></label>
    <label class="opt"><input type="radio" name="fit_goals" value="Neutral" required> <span>Neutral</span></label>
    <label class="opt"><input type="radio" name="fit_goals" value="Somewhat Poorly" required> <span>Somewhat Poorly</span></label>
    <label class="opt"><input type="radio" name="fit_goals" value="Poorly" required> <span>Poorly</span></label>
  </fieldset>
  <fieldset class="q">
    <legend>Do you think our website is easy and fun for people to use?<span class="req" aria-hidden="true"> *</span></legend>
    <label class="opt"><input type="radio" name="easy_fun" value="Agree" required> <span>Agree</span></label>
    <label class="opt"><input type="radio" name="easy_fun" value="Somewhat Agree" required> <span>Somewhat Agree</span></label>
    <label class="opt"><input type="radio" name="easy_fun" value="Neutral" required> <span>Neutral</span></label>
    <label class="opt"><input type="radio" name="easy_fun" value="Somewhat Disagree" required> <span>Somewhat Disagree</span></label>
    <label class="opt"><input type="radio" name="easy_fun" value="Disagree" required> <span>Disagree</span></label>
  </fieldset>
  <fieldset class="q">
    <legend>Which feature do you think best fits Sesh? If you&#x27;re unsure, check more than one box.<span class="req" aria-hidden="true"> *</span></legend>
    <label class="opt"><input type="checkbox" name="enjoy" value="Games"> <span>Educational Games</span></label>
    <label class="opt"><input type="checkbox" name="enjoy" value="Puzzles"> <span>Puzzles</span></label>
    <label class="opt"><input type="checkbox" name="enjoy" value="Coloring pages"> <span>Coloring pages</span></label>
    <label class="opt"><input type="checkbox" name="enjoy" value="custom themes (changing website style and colors)"> <span>custom themes (changing website style and colors)</span></label>
    <label class="opt"><input type="checkbox" name="enjoy" value="daily check-ins"> <span>Educational Modules (Body Map, Cell Lab)</span></label>
  </fieldset>
  <div class="q">
    <label class="q__label" for="easier_changes">What changes could we make to the site to make it more accessible, in your opinion?<span class="req" aria-hidden="true"> *</span></label>
    <textarea id="easier_changes" name="easier_changes" rows="4" required></textarea>
  </div>
  <div class="q">
    <label class="q__label" for="accuracy">How can we ensure information about cancer on our website is accurate and up to date?<span class="req" aria-hidden="true"> *</span></label>
    <textarea id="accuracy" name="accuracy" rows="4" required></textarea>
  </div>
  <fieldset class="q">
    <legend>If you could add only three features, which ones would you choose?<span class="req" aria-hidden="true"> *</span></legend>
    <p class="hint" id="features-hint" aria-live="polite"><span id="feat-count">0</span> of 3 chosen</p>
    <label class="opt"><input type="checkbox" name="features" value="Daily poll/check-in"> <span>Daily poll/check-in</span></label>
    <label class="opt"><input type="checkbox" name="features" value="Body map"> <span>Body map</span></label>
    <label class="opt"><input type="checkbox" name="features" value="Cell lab"> <span>Cell lab</span></label>
    <label class="opt"><input type="checkbox" name="features" value="Online game hub"> <span>Online game hub</span></label>
    <label class="opt"><input type="checkbox" name="features" value="Mentors"> <span>Mentors</span></label>
    <label class="opt opt--other"><input type="checkbox" name="features" value="Other" id="feat-other"> <span>Other:</span>
      <input type="text" id="feat-other-text" name="features_other" aria-label="Other feature" disabled></label>
  </fieldset>
  <div class="q">
    <label class="q__label" for="why_three">Why did you pick the three you chose above?<span class="req" aria-hidden="true"> *</span></label>
    <textarea id="why_three" name="why_three" rows="4" required></textarea>
  </div>
  <div class="q">
    <label class="q__label" for="meme">What&#x27;s your favorite internet meme?<span class="req" aria-hidden="true"> *</span></label>
    <input type="text" id="meme" name="meme" required>
  </div>
  <h2 class="survey__section">We want to know more about YOU, survey taker! :)</h2>
  <div class="q">
    <label class="q__label" for="fav_color">Favorite color?<span class="req" aria-hidden="true"> *</span></label>
    <input type="text" id="fav_color" name="fav_color" required>
  </div>
  <div class="q">
    <label class="q__label" for="notes">Are there any additional note or changes you would suggest to make our website better in the future?<span class="req" aria-hidden="true"> *</span></label>
    <textarea id="notes" name="notes" rows="4" required></textarea>
  </div>
  <button type="submit" class="survey__submit">Submit</button>
</form>
<div id="survey-thanks" class="survey__thanks" hidden>
  <h2>Thank you!</h2>
  <p>Your feedback helps us make the website better.</p>
</div>
</section>
<script>
(function () {
  var form = document.getElementById('survey');
  var thanks = document.getElementById('survey-thanks');
  var feats = form.querySelectorAll('input[name="features"]');
  var enjoy = form.querySelectorAll('input[name="enjoy"]');
  var otherBox = document.getElementById('feat-other');
  var otherText = document.getElementById('feat-other-text');
  var countEl = document.getElementById('feat-count');
  function checked(list) {
    var n = 0;
    for (var i = 0; i < list.length; i++) { if (list[i].checked) n++; }
    return n;
  }
  function update() {
    var n = checked(feats);
    for (var i = 0; i < feats.length; i++) {
      if (!feats[i].checked) feats[i].disabled = n >= 3;
    }
    countEl.textContent = n;
    feats[0].setCustomValidity(n === 3 ? '' : 'Please choose exactly three features.');
    otherText.disabled = !otherBox.checked;
    otherText.required = otherBox.checked;
    enjoy[0].setCustomValidity(checked(enjoy) > 0 ? '' : 'Please choose at least one.');
  }
  form.addEventListener('change', update);
  update();
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var fd = new FormData(form);
    var answers = {};
    fd.forEach(function (value, key) {
      if (answers[key] === undefined) answers[key] = value;
      else if (Array.isArray(answers[key])) answers[key].push(value);
      else answers[key] = [answers[key], value];
    });
    console.log('Survey answers (not saved yet):', answers);
    form.hidden = true;
    thanks.hidden = false;
    window.scrollTo(0, 0);
  });
})();
</script>