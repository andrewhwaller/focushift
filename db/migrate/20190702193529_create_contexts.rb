class CreateContexts < ActiveRecord::Migration[5.2]
  def change
    create_table :contexts do |t|

      t.timestamps
    end
  end
end
