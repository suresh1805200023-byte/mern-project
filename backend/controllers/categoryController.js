import Category from "../models/Category.js";

//  CREATE
export const createCategory = async (req, res) => {
  try {
    const { name } = req.body;

    const category = await Category.create({ name });

    res.json({ message: "Category created", category });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// GET ALL (WITH SUBCATEGORIES)
export const getCategories = async (req, res) => {
  try {
    const categories = await Category.find();

    //  Separate parent & child
    const parents = categories.filter(c => !c.parent);
    const children = categories.filter(c => c.parent);

    //  Attach children to parents
    const structured = parents.map(parent => ({
      ...parent._doc,
      subcategories: children.filter(
        child => child.parent?.toString() === parent._id.toString()
      ),
    }));

    res.json(structured);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
// UPDATE
export const updateCategory = async (req, res) => {
  try {
    const category = await Category.findByIdAndUpdate(
      req.params.id,
      { name: req.body.name },
      { new: true }
    );

    res.json({ message: "Updated", category });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//  DELETE
export const deleteCategory = async (req, res) => {
  try {
    await Category.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};