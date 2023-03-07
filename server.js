const express =  require('express')
const dotenv = require('dotenv')
const cors = require('cors')
const { Configuration, OpenAIApi } = require('openai')
const path = require('path')

dotenv.config()

const app = express()
app.use(cors())
app.use(express.json())

var http = require('http');
var server = http.createServer(app);

var formidable = require('express-formidable');
app.use(formidable());

// app.use(express.static(path.join(__dirname,'./client/dist')));
// app.get('*',function(req,res){
//   res.sendFile(path.join(__dirname,"./client/dist/index.html"));
// })

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static('/public'));
app.use(express.static(__dirname + '/public', { maxAge: '30 days' }));
app.use(express.static(__dirname + '/../public'));
app.use(express.static(__dirname + '/static'));

app.get('/', async (req, res) => {
  res.render('index')
})

app.get('/chat', async (req, res) => {
  res.render('chat')
})

app.post('/add/api', async (req, res) => {
  try{
    const apiKeys = req.fields.apiKey;
    res.status(200).send({
      apiKey: apiKeys
    })
   }catch(error){
    console.log(error)
  }
})


app.post('/add/chat', async (req, res) => {
  try {
    const prompt = req.fields.prompt;
    const configuration = new Configuration({
      apiKey: req.fields.apiKey,
    });
    const openai = new OpenAIApi(configuration);

    const response = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: `${prompt}`,
      temperature: 0, // Higher values means the model will take more risks.
      max_tokens: 3000, // The maximum number of tokens to generate in the completion. Most models have a context length of 2048 tokens (except for the newest models, which support 4096).
      top_p: 1, // alternative to sampling with temperature, called nucleus sampling
      frequency_penalty: 0.5, // Number between -2.0 and 2.0. Positive values penalize new tokens based on their existing frequency in the text so far, decreasing the model's likelihood to repeat the same line verbatim.
      presence_penalty: 0, // Number between -2.0 and 2.0. Positive values penalize new tokens based on whether they appear in the text so far, increasing the model's likelihood to talk about new topics.
    });

    res.status(200).send({
      bot: response.data.choices[0].text
    });

  } catch (error) {
    console.error(error)
    res.status(500).send(error || 'Something went wrong');
  }
})

server.listen(5000, () => console.log('AI server started on http://localhost:5000'))
