import { Injectable } from '@angular/core';
import { WebRequestService } from './web-request.service';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  constructor(private webReqService:WebRequestService) { }

  CreateList(title:String){
    //We Want to send a web request to create a list
    return this.webReqService.post('lists',{title});

  }

  
 UpdateList(id:String,title:string){
    //We Want to send a web request to create a list
    return this.webReqService.patch(`lists/${id}`,{title});

  }

  UpdateTask(taskId:String,listId:string,title:string){
    //We Want to send a web request to create a list
    return this.webReqService.patch(`lists/${listId}/tasks/${taskId}`,{title});

  }

  deleteList(id:string){
    return this.webReqService.delete(`lists/${id}`);
  }

  deleteTask(listId:string,taskId:string){
    return this.webReqService.delete(`lists/${listId}/tasks/${taskId}`);
  }
  
  getLists(){
    return this.webReqService.get('lists');
  }
  
  getTasks(listId:string){
    return this.webReqService.get(`lists/${listId}/tasks`);
  }

  CreateTask(title:String,listId:string){
    //We Want to send a web request to create a list
    return this.webReqService.post(`lists/${listId}/tasks`,{title});

  }

  complete(task:any){
    return this.webReqService.patch(`lists/${task._listId}/tasks/${task._id}`,{
      completed:!task.completed
    });
  }
}
