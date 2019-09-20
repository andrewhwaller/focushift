class DropPartnershipsProjectsTable < ActiveRecord::Migration[5.2]
  def change
    drop_table :partnerships_projects
  end
end
