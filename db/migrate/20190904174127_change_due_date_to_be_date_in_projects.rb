class ChangeDueDateToBeDateInProjects < ActiveRecord::Migration[5.2]
  def change
    change_column :projects, :due_date, :date
  end
end
