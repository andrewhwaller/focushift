class AddContextsProjects < ActiveRecord::Migration[5.2]
  def self.up
    create_table :contexts_projects, :id => false do |t|
      t.integer :context_id
      t.integer :project_id
    end
  end

  def self.down
    drop_table :contexts_projects
  end
end
