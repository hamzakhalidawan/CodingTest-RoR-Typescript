# frozen_string_literal: true

class HomeController < ApplicationController
  before_action :set_todo_item, only: [:edit_todo_item]
  include Rails.application.routes.url_helpers
  include ActiveStorage::Blob::Analyzable

  def landing
    @todos = Todo.all.order(:id)
    @todos = @todos.map do |todo|
      if todo.image.attached?
        {  
          id: todo.id,
          title: todo.title,
          checked: todo.checked,
          todo_image: url_for(todo.image)
        }
      else
        {  
          id: todo.id,
          title: todo.title,
          checked: todo.checked,
          todo_image: ''
        }
      end
    end
  end

  def edit_todo_item
    @todo_item.update(todo_item_params)
  end

  def reset_todo_items
    Todo.update_all(checked: false)
  end

  def todo_image
    todo = Todo.find params[:todoId]
    todo.update(image: params[:image])
  end

  private

  def todo_item_params
    params.permit(:id, :title, :checked)
  end

  def set_todo_item
    @todo_item = Todo.find(todo_item_params[:id])
  end
end