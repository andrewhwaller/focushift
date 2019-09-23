class CreateProjectPartnerships < ActiveRecord::Migration[5.2]
  def change
    create_table :project_partnerships do |t|
      t.references :project, index: true, foreign_key: true
      t.references :partnership, index: true, foreign_key: true

      t.timestamps null: false
    end
  end
end
