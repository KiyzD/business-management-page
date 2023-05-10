class ChangeNameToPasswordInUsers < ActiveRecord::Migration[7.0]
  def change
    rename_column :users, :name, :password
  end
end