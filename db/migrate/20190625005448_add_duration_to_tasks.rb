class AddDurationToTasks < ActiveRecord::Migration[5.2]
  def change
    add_column :tasks, :duration, :string
  end
end
