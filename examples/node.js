var render = require('..');

console.log(render({
  intro: 'Hi!\n\nPlease fill in the *survey* below:',
  outro: 'Bye!',
  user: {userId: '1'},
  url: 'http://localhost/survey',
  token: 'aaa',
  color: 'orange'
}));
