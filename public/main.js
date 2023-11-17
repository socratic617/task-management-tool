var move = document.getElementsByClassName("move");
var trash = document.getElementsByClassName("trash");


Array.from(trash).forEach(function(element) {
      element.addEventListener('click', function(e){//e is the actual event that occured  , waiting for the event to be triggered  by click the event handler 
        console.log('trash :')
        console.log(e.target)
        console.log("button id: ")
        console.log(this.parentNode.id)

        console.log("parent: ")
        console.log(this.parentNode)

        console.log("grandparent: ")
        console.log(this.parentNode.parentNode)

      
        fetch('tasks', {
          method: 'delete',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            _id: this.parentNode.id
          })
        }).then(function (response) {
          window.location.reload()
        })
      });
});

Array.from(move).forEach(function(element) {
      element.addEventListener('click', function(e){//e is the actual event that occured  , waiting for the event to be triggered  by click the event handler 
        // console.log('move :')
        // console.log(e.target)
       
        // console.log("task id: ")
        // console.log(this.parentNode.id)

        console.log("e")
        console.log(e)

        console.log("e.srcelement")
        console.log(e.srcElement);

        console.log("e.target")
        console.log(e.target)

        console.log("this")
        console.log(this)

        console.log("this.innerText")
        console.log(this.innerText)

        let progress = ""

        if(this.innerText == "TO DO"){
          progress = "NEW TASKS"
        }
        else if(this.innerText == "PROGRESS"){
          progress = "IN PROGRESS"
        }
        else if(this.innerText == "DONE"){
          progress = "COMPLETED"
        }

        fetch('tasks', {
          method: 'put',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            _id: this.parentNode.id,
            progress: progress
          })
        }).then(function (response) {
          window.location.reload()
        })
      });
});





