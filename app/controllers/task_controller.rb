class TaskController < ApplicationController
  def create_task
    content = params[:content]
    cost = params[:cost]
    task = Task.new(content: content, cost: cost)
    if task.save
      render json: task
    else
      render json: { error: task.errors }, status: :unprocessable_entity
    end
  end

  def get_tasks
    tasks = Task.all
    render json: tasks
  end

  def reserve_task
    task_id = params[:task_id]
    task = Task.find(task_id)
    task.reserved_by = params[:reserved_by]
    task.is_done = false
    task.save
    render json: task
  end

  def finish_task
    task_id = params[:task_id]
    task = Task.find(task_id)
    task.is_done = true
    user = User.find_by(email: task.reserved_by)
    if user.paycheck == nil
      user.paycheck = 0
    end
    user.paycheck += task.cost
    user.save
    task.save
    render json: {task: task, paycheck: user.paycheck}
  end
end
