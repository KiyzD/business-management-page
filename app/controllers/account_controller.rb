class AccountController < ApplicationController
  def create_account
    email = params[:email]
    first_name = params[:firstName]
    last_name = params[:lastName]
    password = params[:password]
    position = params[:position]

    if User.exists?(email: email)
      render json: { error: 'Taki email jest juz w użyciu' }, status: :conflict
      return
    end

    user = User.new(email: email, password: password, first_name: first_name, last_name: last_name, position: position)
    if user.save
      render json: { message: 'Konto stworzone' }
    else
      render json: { error: user.errors }, status: :unprocessable_entity
    end
  end

  def login
    email = params[:email]
    password = params[:password]

    user = User.find_by(email: email)
    if user
      render json: { email: user.email, first_name: user.first_name, last_name: user.last_name, position: user.position, paycheck: user.paycheck }
    else
      render json: { error: 'Niepoprawny login lub haslo' }, status: :unauthorized
    end
  end

  def get_accounts
    users = User.all
    render json: users
  end

  def payout_paycheck
    email = params[:email]
    user = User.find_by(email: email)
    user.paycheck = 0
    user.save
    render json: user
  end

end