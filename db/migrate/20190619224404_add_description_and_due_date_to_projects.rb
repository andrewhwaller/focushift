class AddDescriptionAndDueDateToProjects < ActiveRecord::Migration[5.2]
  def change
    add_column :projects, :due_date, :datetime
    add_column :projects, :description, :text
  end
end
