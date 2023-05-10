class AddCostToTasks < ActiveRecord::Migration[7.0]
  def change
    add_column :tasks, :cost, :integer
  end
end
