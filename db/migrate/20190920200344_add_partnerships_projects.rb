class AddPartnershipsProjects < ActiveRecord::Migration[5.2]
  def self.up
    create_table :partnerships_projects, :id => false do |t|
      t.integer :partnership_id
      t.integer :project_id
    end
  end

  def self.down
    drop_table :partnerships_projects
  end
end
