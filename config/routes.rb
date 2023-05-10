Rails.application.routes.draw do
  post '/account/create_account', to: 'account#create_account'
  post '/account/login', to: 'account#login'
  post '/task/create_task', to: 'task#create_task'
  get '/task/get_tasks', to: 'task#get_tasks'
  post '/task/reserve_task', to: 'task#reserve_task'
  post '/task/finish_task', to: 'task#finish_task'
  get '/account/get_accounts', to: 'account#get_accounts'
  post '/account/payout_paycheck', to: 'account#payout_paycheck'
end
