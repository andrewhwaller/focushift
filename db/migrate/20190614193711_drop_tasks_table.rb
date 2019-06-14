class DropTasksTable < ActiveRecord::Migration[5.2]
  def up
    drop_table :tasks
  end
end
