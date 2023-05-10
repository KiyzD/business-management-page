class AddPaycheckToUsers < ActiveRecord::Migration[7.0]
  def change
    add_column :users, :paycheck, :integer
  end
end
