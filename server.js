
let util = require('util');
let express = require('express');
let bodyParser = require('body-parser');
let nforce = require('nforce');
let app = express();
let cors = require('cors');
let path = require('path');





app.use(bodyParser.json());

app.options('*', cors());

// authentication

let org = nforce.createConnection({

  clientId: '3MVG9tzQRhEbH_K0gGO5F8oy_g10douvDdPp7ADEzWUolfM.Xq9UugZI8aO7V96llz3maSHzmJZpuOdXvTOBd',

  clientSecret: 'EB0B449C67319AAF162EEEF5373DE047637CA1E9CF84D18EC0BB920C8E796D41',

  redirectUri: 'http://localhost:3000/oauth/_callback',

  mode: 'single'

});
const setCORS = {
  origin: true,
  methods: ['GET'],
  credentials: true
};


const server = app.listen(process.env.PORT || 3000, () => {

  const port = server.address().port;

  console.log('App now running on port', port);

});
server.timeout = 0;


// generic error handler

function handleError(res, reason, message, code) {

  console.log('ERROR: ' + reason);

  res.status(code || 500).json({error: message});

}

app.options('/api/newEntry', cors(setCORS));
app.get('/api/user/:userInput', cors(setCORS),
(req, res) => {

  const userInp = req.params.userInput;
  const queryString = ('SELECT Id, Name FROM User  WHERE name LIKE \'%' + userInp + '%\' LIMIT 3');

  org.query({
        query: queryString},

         // tslint:disable-next-line: no-shadowed-variable
         (err, resp) => {

        if (err) { throw err; }

        if (resp.records && resp.records.length) {

          res.send(resp.records);
        }

      });

    });

app.get('/api/getAccount/:userInput', cors(setCORS),
(req, res) => {

  const userInp = req.params.userInput;
  const queryString = ('SELECT Id, Name FROM Account  WHERE Name LIKE \'%' + userInp + '%\' LIMIT 3');

  org.query({
        query: queryString},

         // tslint:disable-next-line: no-shadowed-variable
         (err, resp) => {

        if (err) { throw err; }

        if (resp.records && resp.records.length) {

          res.send(resp.records);
        }

      });

    });

// GET single Form

const setCORS2 = {
  origin: true,
  methods: ['GET'],
  credentials: true,
  maxAge: 3600
};

app.options('/api/getSuccessProbability', cors(setCORS2));
app.get('/api/getSuccessProbability/:id', cors(setCORS2),
(req, res) => {

  const salesLeadId = req.params.id;

  const querySuccessfulOpps = `
  SELECT
   Id,
   Sales_Lead__r.Id,
   Stagename

  FROM Opportunity WHERE Sales_Lead__r.Id = \'` +
  salesLeadId + '\'';

  org.query({
    query: querySuccessfulOpps},
    (error, response) => {
      if (error) {console.log(error);
      } else {

        let wonBids = 0;
        let lostBids = 0;
        response.records.forEach(element => {
          if (element._fields.stagename === 'Closed Won') {
            wonBids ++;
          } else if (element._fields.stagename === 'Closed Lost') {
            lostBids++;
          }
        });
        const totalBids = wonBids + lostBids;
        if (totalBids !== 0) {
          const  winProb = lostBids / totalBids;
          res.send({loseprobability: winProb});
        } else {
          res.send({loseprobability: 0});
        }
      }
    });
});

app.options('/api/getOpp', cors(setCORS2));
app.get('/api/getOpp/:id', cors(setCORS2),
(req, res) => {

  const userInp = req.params.id;
  const queryString = `
      SELECT
       Id,
       Account.Name,
       Name,
       Description,
       Share_Point_Link__c,
       Sales_Lead__r.Name,
       Sales_Lead__r.Id,
       Website__c,
       Probability,
       Amount,
       WBS_Code__c,
       CloseDate,
       Cost__c,
       Effort_Days__c,
       StageName,

      (
        SELECT Id, User__r.name, User__r.Id FROM Oppotunity_Teams__r
      )

      FROM Opportunity WHERE ID = \'` + userInp + '\'' ;

  org.query({
        query: queryString},

         // tslint:disable-next-line: no-shadowed-variable
         (err, resp) => {

        if (err) { console.log(err);

        } else {
          res.send(resp.records);

        }

      });

    });

const gettingOpp = {
      origin: true,
      methods: ['PUT'],
      credentials: true,
      maxAge: 3600
    };

app.options('/api/getOpp', cors(gettingOpp));
app.put('/api/getOpp/:id', cors(gettingOpp),
(req, res) => {
  const fullFormId = req.params.id;
  const q =

  `SELECT
  Id
 FROM Opportunity WHERE ID = \'` + fullFormId + `\'`;

  org.query({
   query: q},
   (err, resp) => {

    if (!err && resp.records) {

    const opt = resp.records[0];
    opt.set('Name', req.body.oppDetail.name);
    opt.set('Description', req.body.oppDetail.description);
    opt.set('Sales_Lead__c', req.body.oppDetail.salesLead.Id);
    opt.set('Share_Point_Link__c', req.body.oppDetail.sharePointLink);
    opt.set('Website__c', req.body.oppDetail.website);
    opt.set('Probability', (req.body.oppDetail.probability));
    opt.set('Amount', req.body.oppDetail.estimatedValue);
    opt.set('CloseDate', req.body.oppDetail.bidDeadline);
    opt.set('WBS_Code__c', req.body.oppDetail.wbsCode);
    opt.set('Cost__c', req.body.oppDetail.costs);
    opt.set('Effort_Days__c', req.body.oppDetail.effortDays);

    org.update({ sobject: opt},
      (err1) => {
      if (err1) {console.log(err1); res.end(); }

      if (!err1) {
        console.log('it worked!');
        res.status(200).end();
      }
    });

  }
});
});

const deleteBidTeam = {
  origin: true,
  methods: ['DELETE'],
  credentials: true,
  maxAge: 3600
};

app.options('/api/delOpp', cors(deleteBidTeam));
app.delete('/api/delOpp/:id', cors(deleteBidTeam),
(req, res) => {

  const oppId = req.params.id;
  const querystr = `SELECT Id FROM Oppotunity_Team__c WHERE Opportunity__c = \'` + oppId + '\'';

  org.query({query: querystr},
    (err, res1) => {
 if (!err) {
  let i = 0;
  for (i = 0; i < res1.records.length; i++) {
    const bteamId = res1.records[i]._fields.id;
    const bteam = nforce.createSObject('Oppotunity_Team__c', {
      id: bteamId
    });
    org.delete({sobject: bteam},
      (err1) => {
        if (err1) {

        console.error('--> unable to retrieve');

        console.error('--> ' + JSON.stringify(err1));
      } else {
        console.log('bid team deleted');

        res.status(204).end();
      }
      });
  }
  }
});
});

const addBidTeam = {
  origin: true,
  methods: ['POST'],
  credentials: true,
  maxAge: 3600
};

app.options('/api/addTeam', cors(addBidTeam));
app.post('/api/addTeam/:id', cors(addBidTeam),
(req, res) => {
const formId = req.params.id;
const bidTeamArray = req.body.oppDetail.bidTeam;
let i = 0;
for (i = 0; i < bidTeamArray.length; i++) {
  const bidTeam = nforce.createSObject('Oppotunity_Team__c');
  bidTeam.set('User__c', bidTeamArray[i].User__r.Id);
  bidTeam.set('Opportunity__c', formId);
  org.insert({sobject: bidTeam},
    (err) => {
      if (err) { console.log(err);
      } else {
        console.log('bid team added!');
        res.status(200).end();
      }
    });
}
});

// Send for approval

const reqApprovalOpp = {
  origin: true,
  methods: ['PUT'],
  credentials: true,
  maxAge: 3600
};

app.options('/api/reqApprovalOpp', cors(reqApprovalOpp));
app.put('/api/reqApprovalOpp/:id', cors(reqApprovalOpp),
(req, res) => {
const fullFormId = req.params.id;
const q =

`SELECT
Id,
StageName
FROM Opportunity WHERE ID = \'` + fullFormId + `\'`;

org.query({
query: q},
(err, resp) => {

if (!err && resp.records) {

const opt = resp.records[0];


if (opt._fields.stagename === 'Prospecting') {

  opt.set('StageName', 'Qualification');

} else if (opt._fields.stagename === 'Qualification') {

opt.set('StageName', 'PQQ Prepartaion');

} else if (opt._fields.stagename === 'PQQ Prepartaion') {

opt.set('StageName', 'PQQ Submitted');

} else if (opt._fields.stagename ===  'PQQ Submitted') {

  opt.set('StageName', 'ITT Preparation');

} else if (opt._fields.stagename === 'ITT Preparation') {

opt.set('StageName', 'ITT Submitted');

} else if (opt._fields.stagename === 'ITT Submitted') {

opt.set('StageName', 'Presentation');

} else if (opt._fields.stagename === 'Presentation') {

opt.set('StageName', 'Awaiting Approval');

}


org.update({ sobject: opt},
  (err1) => {
  if (err1) {console.log(err1);
             res.end();
 }

  if (!err1) {
    console.log('it worked!');
    res.status(200).end();
  }
});

}
});
});

// Accept

const acceptOpp = {
  origin: true,
  methods: ['PUT'],
  credentials: true,
  maxAge: 3600
};

app.options('/api/acceptOpp', cors(acceptOpp));
app.put('/api/acceptOpp/:id', cors(acceptOpp),
(req, res) => {
const fullFormId = req.params.id;
const q =

`SELECT
Id
FROM Opportunity WHERE ID = \'` + fullFormId + `\'`;

org.query({
query: q},
(err, resp) => {

if (!err && resp.records) {

const opt = resp.records[0];
opt.set('approve_Bid__c', 'YES');

org.update({ sobject: opt},
  (err1) => {
  if (err1) {console.log(err1); res.end(); }

  if (!err1) {
    res.status(200).end();
  }
});
}

});
});

// Reject

const rejectOpp = {
  origin: true,
  methods: ['PUT'],
  credentials: true,
  maxAge: 3600
};

app.options('/api/rejectOpp', cors(rejectOpp));
app.put('/api/rejectOpp/:id', cors(rejectOpp),
(req, res) => {
const fullFormId = req.params.id;
const q =

`SELECT
Id
FROM Opportunity WHERE ID = \'` + fullFormId + `\'`;

org.query({
query: q},
(err, resp) => {

if (!err && resp.records) {

const opt = resp.records[0];
opt.set('approve_Bid__c', 'NO');

org.update({ sobject: opt},
  (err1) => {
  if (err1) {console.log(err1); res.end(); }

  if (!err1) {
    console.log('rejected!');
    res.status(200).end();
  }
});
}

});
});

// GET most recent opp
const setCORS1 = {
      origin: true,
      methods: ['GET'],
      credentials: true,
      maxAge: 3600
    };

app.options('/api/getOpp', cors(setCORS1));
app.get('/api/getOpp', cors(setCORS1),
    (req, res) => {

      const queryString = `
      SELECT
       Id,
       Name,
       Description,
       Share_Point_Link__c,
       Sales_Lead__r.Name,
       Sales_Lead__r.Id,
       Website__c,
       Probability,
       Amount,
       WBS_Code__c,
       CloseDate,
       Cost__c,
       Effort_Days__c,
       StageName,

      (
        SELECT User__r.name, User__r.Id FROM Oppotunity_Teams__r
      )

      FROM Opportunity ORDER BY CloseDate`;

      org.query({
            query: queryString},

             // tslint:disable-next-line: no-shadowed-variable
             (err, resp) => {

            if (err) { throw err; }

            if (resp.records && resp.records.length) {

              res.send(resp.records);
            }

          });

        });

// GET Opp based on SalesLead


app.options('/api/getslOpp', cors(setCORS1));
app.get('/api/getslOpp', cors(setCORS1),
(req, res) => {

  const queryString = `
  SELECT
   Id,
   Name,
   Description,
   Share_Point_Link__c,
   Sales_Lead__r.Name,
   Sales_Lead__r.Id,
   Website__c,
   Probability,
   Amount,
   WBS_Code__c,
   CloseDate,
   Cost__c,
   Effort_Days__c,
   StageName,

  (
    SELECT User__r.name, User__r.Id FROM Oppotunity_Teams__r
  )

  FROM Opportunity WHERE Sales_Lead__r.Name = 'Imtiaz Haque' ORDER BY CreatedDate desc`;

  org.query({
        query: queryString},

         // tslint:disable-next-line: no-shadowed-variable
         (err, resp) => {

        if (err) { throw err; }

        if (resp.records && resp.records.length) {

          res.send(resp.records);
        }

      });

    });


app.options('/api/getawaitingApprovalOpp', cors(setCORS1));
app.get('/api/getawaitingApprovalOpp', cors(setCORS1),
    (req, res) => {

      const queryString = `
      SELECT
       Id,
       Name,
       Description,
       Share_Point_Link__c,
       Sales_Lead__r.Name,
       Sales_Lead__r.Id,
       Website__c,
       Probability,
       Amount,
       WBS_Code__c,
       CloseDate,
       Cost__c,
       Effort_Days__c,
       StageName,

      (
        SELECT User__r.name, User__r.Id FROM Oppotunity_Teams__r
      )

      FROM Opportunity WHERE StageName = 'Awaiting Approval'`;

      org.query({
            query: queryString},

             // tslint:disable-next-line: no-shadowed-variable
             (err, resp) => {

            if (err) { throw err; }

            if (resp.records && resp.records.length) {

              res.send(resp.records);
            }

          });

        });

// CORS set-up

const postCORS = {
  origin: true,
  methods: ['POST'],
  credentials: true,
  maxAge: 3600
};

// POST new bid
// CORS set-up
app.options('/api/newEntry', cors(postCORS));

app.post('/api/newEntry', cors(postCORS),

(req, res) => {
  const account = req.body.oppDetail.account;
  const name = req.body.oppDetail.name;
  const description = req.body.oppDetail.description;
  const shplink = req.body.oppDetail.sharePointLink;
  const website = req.body.oppDetail.website;
  const probability = req.body.oppDetail.probability;
  const estimatedValue = req.body.oppDetail.estimatedValue;
  const salesLead = req.body.oppDetail.salesLead;

  // checking for if bid dealine was selected
  // otherwise using generic date as its mandatory in SF
  let bidDeadline;

  if (!(req.body.preBid.bidDeadline)) {

      bidDeadline = '2019-08-22';

  } else {

    bidDeadline = req.body.preBid.bidDeadline;

  }

  const wbs = req.body.preBid.wbsCode;
  const cost = req.body.preBid.costs;
  const effortDays = req.body.preBid.effortDays;
  const bidTeam = req.body.preBid.bidTeam;
  let oppId = '';

  // making sure a name is entered
  // otherwise name will be replaced by ID automaticall in salesforce
  if (!(req.body.oppDetail.name)) {

    handleError(res, 'Invalid user input', 'Please enter the Name.', 400);

  }

  const opt = nforce.createSObject('Opportunity');
  opt.set('AccountId', account)
  opt.set('Name', name);
  opt.set('Description', description);
  opt.set('Sales_Lead__c', salesLead);
  opt.set('Share_Point_Link__c', shplink);
  opt.set('Website__c', website);
  opt.set('Probability', (probability * 100));
  opt.set('Amount', estimatedValue);
  opt.set('StageName', 'Prospecting');
  opt.set('CloseDate', bidDeadline);

  opt.set('WBS_Code__c', wbs);
  opt.set('Cost__c', cost);
  opt.set('Effort_Days__c', effortDays);


  org.insert({ sobject: opt },

    (err, resp) => {

    if (err) {

      console.error('--> unable to insert');

      console.error('--> ' + JSON.stringify(err));
      res.end();
    } else {

      res.end();

      oppId = resp.id;

      if (bidTeam != null && oppId !== '') {

      const bidT = nforce.createSObject('Oppotunity_Team__c');

      let i = 0;

      for (i = 0; i < bidTeam.length; i++) {
         const bidTeamUser = bidTeam[i].id;
         bidT.set('User__c', bidTeamUser);
         bidT.set('Opportunity__c', oppId);

         org.insert({ sobject: bidT });
         res.end();
        }

      }

    }

  });

});

const postNewAccounts = {
  origin: true,
  methods: ['POST'],
  credentials: true,
  maxAge: 3600
};

app.options('/api/newAccount', cors(postNewAccounts));

app.post('/api/newAccount', cors(postNewAccounts),

(req,res)=>{

const accName = req.body.accountName;
const industry = req.body.industry;

const accountObject =  nforce.createSObject('Account');

accountObject.set('Name', accName);
accountObject.set('Industry', industry);

org.insert({ sobject: accountObject }, (err, resp) =>{

  if(!err) {
    const data = { Id: resp.id};
    res.send(data);
  }
});


});


const postTaskCORS = {
  origin: true,
  methods: ['POST'],
  credentials: true,
  maxAge: 3600
};

// POST new task
// CORS set-up
app.options('/api/newTask', cors(postTaskCORS));

app.post('/api/newTask', cors(postTaskCORS),

(req, res) => {

  const subject = req.body.subject;
  const dueDate = req.body.duedate;
  const relatedTo = req.body.relatedTo;
  const assignToUser = req.body.assignToUser.Id;
  const status = req.body.status;
  const comment = req.body.comment;

  const task = nforce.createSObject('Task');

  task.set('Subject', subject);
  task.set('ActivityDate', dueDate);
  task.set('WhatId', relatedTo);
  task.set('OwnerId', assignToUser);
  task.set('Status', 'In Progress');
  task.set('Description', comment);

  org.insert({ sobject: task });

  res.end();

});

const getAllTask = {
  origin: true,
  methods: ['GET'],
  credentials: true,
  maxAge: 3600
}

app.options('/api/getAllTask', cors(getAllTask));
app.get('/api/getAllTask', cors(getAllTask),
(req, res) => {
  const queryStr = `
  SELECT Id, Subject, ActivityDate, Description, Status, WhatId
  FROM
  Task`

  org.query({
    query: queryStr
  },
  (err, resp) => {
    if (err) {throw err; }
    if (resp.records) {
      res.send(resp);
    }else {
      res.send(null);
    }
  });
});


// app.options('/api/getTask', cors(setCORS1));
// app.get('/api/getTask/:id', cors(setCORS1),
//     (req, res) => {
//       const fullFormId = req.params.id;
//       const queryString = `
//       SELECT
//        Id,
//        Subject,
//        ActivityDate,
//        Owner.Name,
//        Status,
//        Description,

//       FROM Task WHERE WhatId = \'` + fullFormId + `\' ORDER BY ActivityDate`;

//       org.query({
//             query: queryString},

//              // tslint:disable-next-line: no-shadowed-variable
//              (err, resp) => {
//               console.log(resp.records._fields);
//             if (err) { throw err; }

//             if (resp.records && resp.records.length) {

//               res.send(resp.records);
//             } else {
//               res.send(null);
//             }

//           });

//         });

const updateTaskStatus = {
          origin: true,
          methods: ['PUT'],
          credentials: true,
          maxAge: 3600
        };

app.options('/api/taskStatusUpdate', cors(updateTaskStatus));
app.put('/api/taskStatusUpdate/:id', cors(updateTaskStatus),
        (req, res) => {
          const fullFormId = req.params.id;
          const q =

          `SELECT
          Id,
          Status
         FROM Task WHERE ID = \'` + fullFormId + `\'`;

          org.query({
           query: q},
           (err, resp) => {

            if (!err && resp.records) {

            const task = resp.records[0];
            task.set('Id', fullFormId);
            if (task._fields.status === 'In Progress' || task._fields.status === 'Not Started') {
            task.set('Status', 'Completed');
            } else if (task._fields.status === 'Completed') {
              task.set('Status', 'Not Started');
            }


            org.update({ sobject: task},
              (err1) => {
              if (err1) {console.log(err1); res.end(); }

              if (!err1) {
                res.status(200).end();
              }
            });

          }
        });
        });



        // tslint:disable-next-line: one-variable-per-declaration
        let username      = 'imtih65@gmail.com',
        password      = 'System808?',
        securityToken = 'EZxMMMkUPmek8KYhWlyz2QeX',
        oauth;
        notificationArray = [];

        org.authenticate({ username, password, securityToken },
        (err, resp) => {

        if (!err) {
          console.log('Access Token: ' + resp.access_token);
          accessToken = resp.access_token;
          oauth = resp;
        // Notification logic

        const client = org.createStreamClient();
        const accs = client.subscribe({ topic: 'OppApproval', replayId: -1});

        accs.on('data', data => {

        notificationArray.push(data.sobject);
        console.log(data.sobject);


        });

        accs.on('error', err => {
         console.log('subscription error');
         console.log(err);
         accs.cancel();
        });

        // end of notification logic
        }
        if (err) {return console.log(err); }

        });

        app.get('/api/not2', cors(setCORS1),
        (req, res) => {
          res.send(notificationArray);
        });

// end of auth

app.use(express.static(__dirname + '/dist/ng-bid'));

app.use('/notifications', express.static(__dirname + 'public'));

app.get('/ng/*', (req, res) => {

    res.sendFile(__dirname + '/dist/ng-bid/index.html');

});
