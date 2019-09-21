class CreateProjectContexts < ActiveRecord::Migration[5.2]
  def change
    create_table :project_contexts do |t|
      t.references :project, index: true, foreign_key: true
      t.references :context, index: true, foreign_key: true

      t.timestamps null: false
    end
  end
end
