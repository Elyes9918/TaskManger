import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { List } from 'src/app/models/list.model';
import { TaskService } from 'src/app/task.service';

@Component({
  selector: 'app-task-view',
  templateUrl: './task-view.component.html',
  styleUrls: ['./task-view.component.scss']
})
export class TaskViewComponent implements OnInit {

  lists:any[] | undefined;
  tasks:any[] | undefined;

  selectedListId:string="";



  constructor(private taskService:TaskService,private route:ActivatedRoute,private router:Router) { }

  ngOnInit(): void {
    this.route.params.subscribe(
      (params: Params)=>{
        if(params.listId){
          this.selectedListId=params.listId;
        
        this.taskService.getTasks(params.listId).subscribe((tasks:any)=>{
          this.tasks=tasks;

        })
      }else{
        this.tasks=undefined;
      }
      }
      
    )
    this.taskService.getLists().subscribe((lists:any)=>{
      this.lists=lists;
    })
  }

  onTaskClick(task:any){
    //we want to set the task to completed
    this.taskService.complete(task).subscribe(()=>{
      console.log("completed succefully")
      //task has been set to completed succefully
      task.completed=!task.completed;
    })

  }
  
  onDeleteListClick(){
    this.taskService.deleteList(this.selectedListId).subscribe((res:any)=>{
      this.router.navigate(['/lists'])
      console.log(res);
    })
    
  }

  onDeleteTaskClick(id:string){
    this.taskService.deleteTask(this.selectedListId,id).subscribe((res:any)=>{
     // this.router.navigate(['/lists'])
      console.log(res);
      this.tasks = this.tasks?.filter(val=>val._id !==id);
    })
    
  }

}
