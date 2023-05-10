class CreateTasks < ActiveRecord::Migration[7.0]
  def change
    create_table :tasks do |t|
      t.string :content
      t.string :reserved_by
      t.boolean :is_done
      t.integer :time_stamp

      t.timestamps
    end
  end
end
