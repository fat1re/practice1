import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import './App.css';

const API_URL = 'http://localhost:3000/api';




const validation = {
  
  name: (value) => {
    if (!value || value.trim().length === 0) return 'Название не может быть пусто';
    if (value.trim().length < 3) return 'Название должно быть минимум 3 символа';
    return null;
  },

  
  positiveNumber: (value, fieldName = 'Значение') => {
    if (!value && value !== 0) return `${fieldName} не может быть пусто`;
    const num = parseFloat(value);
    if (isNaN(num)) return `${fieldName} должно быть числом`;
    if (num < 0) return `${fieldName} не может быть отрицательным`;
    return null;
  },

  
  quantity: (value) => {
    if (!value) return 'Количество не может быть пусто';
    const num = parseInt(value);
    if (isNaN(num)) return 'Количество должно быть целым числом';
    if (num <= 0) return 'Количество должно быть больше 0';
    return null;
  },

  
  dimension: (value, fieldName = 'Размер') => {
    if (!value && value !== 0) return `${fieldName} не может быть пусто`;
    const num = parseFloat(value);
    if (isNaN(num)) return `${fieldName} должно быть числом`;
    if (num <= 0) return `${fieldName} должно быть больше 0`;
    return null;
  },

  
  coefficient: (value) => {
    if (!value && value !== 0) return 'Коэффициент не может быть пусто';
    const num = parseFloat(value);
    if (isNaN(num)) return 'Коэффициент должно быть числом';
    if (num <= 0) return 'Коэффициент должно быть больше 0';
    return null;
  },

  
  percentage: (value) => {
    if (!value && value !== 0) return '% потерь не может быть пусто';
    const num = parseFloat(value);
    if (isNaN(num)) return '% потерь должно быть числом';
    if (num < 0) return '% потерь не может быть отрицательным';
    if (num > 100) return '% потерь не может быть больше 100';
    return null;
  },

  
  article: (value) => {
    if (!value || value.trim().length === 0) return 'Артикул не может быть пусто';
    if (value.trim().length < 2) return 'Артикул должен быть минимум 2 символа';
    return null;
  },

  
  select: (value, fieldName = 'Поле') => {
    if (!value) return `Выберите ${fieldName}`;
    return null;
  },
};




function HomePage() {
  const [stats, setStats] = useState({
    products: 0,
    types: 0,
    materials: 0,
    workshops: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [productsRes, typesRes, materialsRes, workshopsRes] = await Promise.all([
          fetch(`${API_URL}/products`),
          fetch(`${API_URL}/product-types`),
          fetch(`${API_URL}/materials`),
          fetch(`${API_URL}/workshops`),
        ]);

        const products = await productsRes.json();
        const types = await typesRes.json();
        const materials = await materialsRes.json();
        const workshops = await workshopsRes.json();

        setStats({
          products: Array.isArray(products) ? products.length : 0,
          types: Array.isArray(types) ? types.length : 0,
          materials: Array.isArray(materials) ? materials.length : 0,
          workshops: Array.isArray(workshops) ? workshops.length : 0,
        });
      } catch (error) {
        console.error('Ошибка загрузки статистики:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="page home-page">
      <div className="hero">
        <h1>Система управления производством мебели</h1>
        <p>Полный контроль над продукцией, цехами и материалами</p>
      </div>

      <div className="stats-container">
        <div className="stat-card">
          <div className="stat-icon"></div>
          <div className="stat-info">
            <div className="stat-number">{stats.products}</div>
            <div className="stat-label">Продуктов</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon"></div>
          <div className="stat-info">
            <div className="stat-number">{stats.types}</div>
            <div className="stat-label">Типов</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon"></div>
          <div className="stat-info">
            <div className="stat-number">{stats.materials}</div>
            <div className="stat-label">Материалов</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon"></div>
          <div className="stat-info">
            <div className="stat-number">{stats.workshops}</div>
            <div className="stat-label">Цехов</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function CalculatorPage() {
  const [products, setProducts] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [formData, setFormData] = useState({
    productId: '',
    materialId: '',
    quantity: '',
    width: '',
    length: '',
  });
  const [errors, setErrors] = useState({});
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [productsRes, materialsRes] = await Promise.all([
        fetch(`${API_URL}/products`),
        fetch(`${API_URL}/materials`),
      ]);

      const productsData = await productsRes.json();
      const materialsData = await materialsRes.json();

      setProducts(Array.isArray(productsData) ? productsData : []);
      setMaterials(Array.isArray(materialsData) ? materialsData : []);
    } catch (err) {
      console.error('Ошибка загрузки данных:', err);
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    newErrors.productId = validation.select(formData.productId, 'продукт');
    newErrors.materialId = validation.select(formData.materialId, 'материал');
    newErrors.quantity = validation.quantity(formData.quantity);
    newErrors.width = validation.dimension(formData.width, 'Ширина');
    newErrors.length = validation.dimension(formData.length, 'Длина');

    setErrors(newErrors);
    return Object.values(newErrors).every(err => !err);
  };

  const calculate = () => {
    if (!validateForm()) return;

    const product = products.find(p => p.id === parseInt(formData.productId));
    const material = materials.find(m => m.id === parseInt(formData.materialId));

    if (!product || !material) {
      alert('Выбранный продукт или материал не найден');
      return;
    }

    const quantity = parseInt(formData.quantity);
    const width = parseFloat(formData.width);
    const length = parseFloat(formData.length);
    const coefficient = parseFloat(product.type?.coefficient || 1);
    const missingPercent = parseFloat(material.missingPercent || 0);

    const baseRawMaterial = width * length * coefficient;
    const rawMaterialForQuantity = baseRawMaterial * quantity;
    const withWaste = rawMaterialForQuantity * (1 + missingPercent / 100);
    const finalResult = Math.ceil(withWaste);

    setResult({
      baseRawMaterial: baseRawMaterial.toFixed(2),
      rawMaterialForQuantity: rawMaterialForQuantity.toFixed(2),
      withWaste: withWaste.toFixed(2),
      finalResult: finalResult,
      productName: product.name,
      materialName: material.name,
    });
  };

  if (loading) return <div className="page"><p>Загрузка...</p></div>;

  return (
    <div className="page">
      <h2> Калькулятор расчета сырья</h2>

      <div className="form-card" style={{ maxWidth: '600px' }}>
        <h3>Параметры расчета</h3>
        <div className="form-grid">
          <div className="form-group">
            <select
              value={formData.productId}
              onChange={(e) => {
                setFormData({ ...formData, productId: e.target.value });
                setErrors({ ...errors, productId: null });
              }}
              className={errors.productId ? 'input-error' : ''}
            >
              <option value="">Выберите продукт</option>
              {products.map((product) => (
                <option key={product.id} value={product.id}>
                  {product.name} (коэф: {product.type?.coefficient || 1})
                </option>
              ))}
            </select>
            {errors.productId && <span className="error-text"> {errors.productId}</span>}
          </div>

          <div className="form-group">
            <select
              value={formData.materialId}
              onChange={(e) => {
                setFormData({ ...formData, materialId: e.target.value });
                setErrors({ ...errors, materialId: null });
              }}
              className={errors.materialId ? 'input-error' : ''}
            >
              <option value="">Выберите материал</option>
              {materials.map((material) => (
                <option key={material.id} value={material.id}>
                  {material.name} (потери: {material.missingPercent}%)
                </option>
              ))}
            </select>
            {errors.materialId && <span className="error-text"> {errors.materialId}</span>}
          </div>

          <div className="form-group">
            <input
              type="number"
              min="1"
              placeholder="Количество единиц"
              value={formData.quantity}
              onChange={(e) => {
                setFormData({ ...formData, quantity: e.target.value });
                setErrors({ ...errors, quantity: null });
              }}
              className={errors.quantity ? 'input-error' : ''}
            />
            {errors.quantity && <span className="error-text"> {errors.quantity}</span>}
          </div>

          <div className="form-group">
            <input
              type="number"
              step="0.1"
              min="0.1"
              placeholder="Ширина (см)"
              value={formData.width}
              onChange={(e) => {
                setFormData({ ...formData, width: e.target.value });
                setErrors({ ...errors, width: null });
              }}
              className={errors.width ? 'input-error' : ''}
            />
            {errors.width && <span className="error-text"> {errors.width}</span>}
          </div>

          <div className="form-group">
            <input
              type="number"
              step="0.1"
              min="0.1"
              placeholder="Длина (см)"
              value={formData.length}
              onChange={(e) => {
                setFormData({ ...formData, length: e.target.value });
                setErrors({ ...errors, length: null });
              }}
              className={errors.length ? 'input-error' : ''}
            />
            {errors.length && <span className="error-text"> {errors.length}</span>}
          </div>
        </div>

        <div className="form-actions">
          <button className="btn btn-primary" onClick={calculate}>
            Рассчитать
          </button>
        </div>
      </div>

      {result && (
        <div className="calculator-result">
          <h3> Результаты расчета</h3>

          <div className="result-info">
            <div className="result-item">
              <span className="result-label">Продукт:</span>
              <span className="result-value">{result.productName}</span>
            </div>
            <div className="result-item">
              <span className="result-label">Материал:</span>
              <span className="result-value">{result.materialName}</span>
            </div>
          </div>

          <div className="result-steps">
            <div className="step">
              <div className="step-number"></div>
              <div className="step-content">
                <div className="step-title">На одну единицу</div>
                <div className="step-value">{result.baseRawMaterial} ед.</div>
              </div>
            </div>

            <div className="step">
              <div className="step-number"></div>
              <div className="step-content">
                <div className="step-title">На все единицы</div>
                <div className="step-value">{result.rawMaterialForQuantity} ед.</div>
              </div>
            </div>

            <div className="step">
              <div className="step-number"></div>
              <div className="step-content">
                <div className="step-title">С учетом потерь</div>
                <div className="step-value">{result.withWaste} ед.</div>
              </div>
            </div>
          </div>

          <div className="result-final">
            <div className="final-label"> ИТОГО СЫРЬЯ:</div>
            <div className="final-value">{result.finalResult} ед.</div>
          </div>
        </div>
      )}
    </div>
  );
}

function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [types, setTypes] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    article: '',
    minimumCost: '',
    typeId: '',
    materialId: '',
  });
  const [errors, setErrors] = useState({});
  const [error, setError] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [productsRes, typesRes, materialsRes] = await Promise.all([
        fetch(`${API_URL}/products`),
        fetch(`${API_URL}/product-types`),
        fetch(`${API_URL}/materials`),
      ]);

      const productsData = await productsRes.json();
      const typesData = await typesRes.json();
      const materialsData = await materialsRes.json();

      setProducts(Array.isArray(productsData) ? productsData : []);
      setTypes(Array.isArray(typesData) ? typesData : []);
      setMaterials(Array.isArray(materialsData) ? materialsData : []);
      setError(null);
    } catch (err) {
      setError('Ошибка загрузки данных');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    newErrors.name = validation.name(formData.name);
    newErrors.article = validation.article(formData.article);
    newErrors.minimumCost = validation.positiveNumber(formData.minimumCost, 'Минимальная цена');
    newErrors.typeId = validation.select(formData.typeId, 'тип');
    newErrors.materialId = validation.select(formData.materialId, 'материал');

    setErrors(newErrors);
    return Object.values(newErrors).every(err => !err);
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    try {
      const payload = {
        name: formData.name,
        article: formData.article,
        minimumCost: parseFloat(formData.minimumCost),
        typeId: parseInt(formData.typeId),
        materialId: parseInt(formData.materialId),
      };

      const url = editingId ? `${API_URL}/products/${editingId}` : `${API_URL}/products`;
      const method = editingId ? 'PATCH' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error('Ошибка сохранения');

      await loadData();
      setShowForm(false);
      setEditingId(null);
      setFormData({ name: '', article: '', minimumCost: '', typeId: '', materialId: '' });
      setErrors({});
      alert(editingId ? 'Продукт обновлен' : 'Продукт создан');
    } catch (err) {
      alert('Ошибка: ' + err.message);
    }
  };

  const handleEdit = (product) => {
    setFormData({
      name: product.name,
      article: product.article,
      minimumCost: product.minimumCost,
      typeId: product.typeId,
      materialId: product.materialId,
    });
    setEditingId(product.id);
    setShowForm(true);
    setErrors({});
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Удалить продукт?')) return;

    try {
      const response = await fetch(`${API_URL}/products/${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Ошибка удаления');
      await loadData();
      alert('Продукт удален');
    } catch (err) {
      alert('Ошибка: ' + err.message);
    }
  };

  if (loading) return <div className="page"><p>Загрузка...</p></div>;

  return (
    <div className="page">
      <div className="page-header">
        <h2> Продукты</h2>
        <button className="btn btn-primary" onClick={() => {
          if (showForm) {
            setShowForm(false);
            setEditingId(null);
            setFormData({ name: '', article: '', minimumCost: '', typeId: '', materialId: '' });
            setErrors({});
          } else {
            setShowForm(true);
          }
        }}>
          {showForm ? 'Отменить' : '+ Добавить'}
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      {showForm && (
        <div className="form-card">
          <h3>{editingId ? 'Редактирование' : 'Новый продукт'}</h3>
          <div className="form-grid">
            <div className="form-group">
              <input
                type="text"
                placeholder="Название"
                value={formData.name}
                onChange={(e) => {
                  setFormData({ ...formData, name: e.target.value });
                  setErrors({ ...errors, name: null });
                }}
                className={errors.name ? 'input-error' : ''}
              />
              {errors.name && <span className="error-text"> {errors.name}</span>}
            </div>

            <div className="form-group">
              <input
                type="text"
                placeholder="Артикул"
                value={formData.article}
                onChange={(e) => {
                  setFormData({ ...formData, article: e.target.value });
                  setErrors({ ...errors, article: null });
                }}
                className={errors.article ? 'input-error' : ''}
              />
              {errors.article && <span className="error-text"> {errors.article}</span>}
            </div>

            <div className="form-group">
              <input
                type="number"
                min="0"
                step="0.01"
                placeholder="Минимальная цена"
                value={formData.minimumCost}
                onChange={(e) => {
                  setFormData({ ...formData, minimumCost: e.target.value });
                  setErrors({ ...errors, minimumCost: null });
                }}
                className={errors.minimumCost ? 'input-error' : ''}
              />
              {errors.minimumCost && <span className="error-text"> {errors.minimumCost}</span>}
            </div>

            <div className="form-group">
              <select 
                value={formData.typeId} 
                onChange={(e) => {
                  setFormData({ ...formData, typeId: e.target.value });
                  setErrors({ ...errors, typeId: null });
                }}
                className={errors.typeId ? 'input-error' : ''}
              >
                <option value="">Выберите тип</option>
                {types.map((type) => (
                  <option key={type.id} value={type.id}>{type.name}</option>
                ))}
              </select>
              {errors.typeId && <span className="error-text"> {errors.typeId}</span>}
            </div>

            <div className="form-group">
              <select 
                value={formData.materialId} 
                onChange={(e) => {
                  setFormData({ ...formData, materialId: e.target.value });
                  setErrors({ ...errors, materialId: null });
                }}
                className={errors.materialId ? 'input-error' : ''}
              >
                <option value="">Выберите материал</option>
                {materials.map((material) => (
                  <option key={material.id} value={material.id}>{material.name}</option>
                ))}
              </select>
              {errors.materialId && <span className="error-text"> {errors.materialId}</span>}
            </div>
          </div>
          <div className="form-actions">
            <button className="btn btn-primary" onClick={handleSave}>
              {editingId ? 'Сохранить' : 'Создать'}
            </button>
            <button className="btn btn-secondary" onClick={() => setShowForm(false)}>
              Отменить
            </button>
          </div>
        </div>
      )}

      <div className="table-wrapper">
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Название</th>
              <th>Артикул</th>
              <th>Тип</th>
              <th>Материал</th>
              <th>Цена (₽)</th>
              <th>Действия</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id}>
                <td className="text-muted">{product.id}</td>
                <td className="bold">{product.name}</td>
                <td className="monospace">{product.article}</td>
                <td>{product.type?.name || '-'}</td>
                <td>{product.material?.name || '-'}</td>
                <td className="text-right">{parseFloat(product.minimumCost).toLocaleString()}</td>
                <td className="actions">
                  <button className="btn btn-primary mr-10" onClick={() => handleEdit(product)} title="Редактировать">Редактировать</button>
                  <button className="btn btn-primary mr-10" onClick={() => handleDelete(product.id)} title="Удалить">Удалить</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ProductTypesPage() {
  const [types, setTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ name: '', coefficient: '' });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    loadTypes();
  }, []);

  const loadTypes = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/product-types`);
      const data = await response.json();
      setTypes(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Ошибка загрузки:', err);
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    newErrors.name = validation.name(formData.name);
    newErrors.coefficient = validation.coefficient(formData.coefficient);

    setErrors(newErrors);
    return Object.values(newErrors).every(err => !err);
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    try {
      const url = editingId ? `${API_URL}/product-types/${editingId}` : `${API_URL}/product-types`;
      const method = editingId ? 'PATCH' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          coefficient: parseFloat(formData.coefficient),
        }),
      });

      if (!response.ok) throw new Error('Ошибка сохранения');

      await loadTypes();
      setShowForm(false);
      setEditingId(null);
      setFormData({ name: '', coefficient: '' });
      setErrors({});
      alert(editingId ? 'Тип обновлен' : 'Тип создан');
    } catch (err) {
      alert('Ошибка: ' + err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Удалить тип?')) return;

    try {
      const response = await fetch(`${API_URL}/product-types/${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Ошибка удаления');
      await loadTypes();
      alert('Тип удален');
    } catch (err) {
      alert('Ошибка: ' + err.message);
    }
  };

  if (loading) return <div className="page"><p>Загрузка...</p></div>;

  return (
    <div className="page">
      <div className="page-header">
        <h2> Типы продукции</h2>
        <button className="btn btn-primary" onClick={() => {
          setShowForm(!showForm);
          setEditingId(null);
          setFormData({ name: '', coefficient: '' });
          setErrors({});
        }}>
          {showForm ? 'Отменить' : '+ Добавить'}
        </button>
      </div>

      {showForm && (
        <div className="form-card">
          <h3>{editingId ? 'Редактирование' : 'Новый тип'}</h3>
          <div className="form-grid">
            <div className="form-group">
              <input
                type="text"
                placeholder="Название"
                value={formData.name}
                onChange={(e) => {
                  setFormData({ ...formData, name: e.target.value });
                  setErrors({ ...errors, name: null });
                }}
                className={errors.name ? 'input-error' : ''}
              />
              {errors.name && <span className="error-text"> {errors.name}</span>}
            </div>

            <div className="form-group">
              <input
                type="number"
                step="0.1"
                min="0.1"
                placeholder="Коэффициент"
                value={formData.coefficient}
                onChange={(e) => {
                  setFormData({ ...formData, coefficient: e.target.value });
                  setErrors({ ...errors, coefficient: null });
                }}
                className={errors.coefficient ? 'input-error' : ''}
              />
              {errors.coefficient && <span className="error-text"> {errors.coefficient}</span>}
            </div>
          </div>
          <div className="form-actions">
            <button className="btn btn-primary" onClick={handleSave}>
              {editingId ? 'Сохранить' : 'Создать'}
            </button>
            <button className="btn btn-secondary" onClick={() => setShowForm(false)}>
              Отменить
            </button>
          </div>
        </div>
      )}

      <div className="table-wrapper">
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Название</th>
              <th>Коэффициент</th>
              <th>Действия</th>
            </tr>
          </thead>
          <tbody>
            {types.map((type) => (
              <tr key={type.id}>
                <td className="text-muted">{type.id}</td>
                <td className="bold">{type.name}</td>
                <td>{parseFloat(type.coefficient).toFixed(2)}</td>
                <td className="actions">
                  <button className="btn btn-primary mr-10" onClick={() => {
                    setFormData({ name: type.name, coefficient: type.coefficient });
                    setEditingId(type.id);
                    setShowForm(true);
                    setErrors({});
                  }}>Редактировать</button>
                  <button className="btn btn-primary mr-10 btn-danger" onClick={() => handleDelete(type.id)}>Удалить</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function MaterialsPage() {
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ name: '', missingPercent: '' });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    loadMaterials();
  }, []);

  const loadMaterials = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/materials`);
      const data = await response.json();
      setMaterials(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Ошибка загрузки:', err);
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    newErrors.name = validation.name(formData.name);
    newErrors.missingPercent = validation.percentage(formData.missingPercent);

    setErrors(newErrors);
    return Object.values(newErrors).every(err => !err);
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    try {
      const url = editingId ? `${API_URL}/materials/${editingId}` : `${API_URL}/materials`;
      const method = editingId ? 'PATCH' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          missingPercent: parseFloat(formData.missingPercent),
        }),
      });

      if (!response.ok) throw new Error('Ошибка сохранения');

      await loadMaterials();
      setShowForm(false);
      setEditingId(null);
      setFormData({ name: '', missingPercent: '' });
      setErrors({});
      alert(editingId ? 'Материал обновлен' : 'Материал создан');
    } catch (err) {
      alert('Ошибка: ' + err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Удалить материал?')) return;

    try {
      const response = await fetch(`${API_URL}/materials/${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Ошибка удаления');
      await loadMaterials();
      alert('Материал удален');
    } catch (err) {
      alert('Ошибка: ' + err.message);
    }
  };

  if (loading) return <div className="page"><p>Загрузка...</p></div>;

  return (
    <div className="page">
      <div className="page-header">
        <h2> Материалы</h2>
        <button className="btn btn-primary" onClick={() => {
          setShowForm(!showForm);
          setEditingId(null);
          setFormData({ name: '', missingPercent: '' });
          setErrors({});
        }}>
          {showForm ? 'Отменить' : '+ Добавить'}
        </button>
      </div>

      {showForm && (
        <div className="form-card">
          <h3>{editingId ? 'Редактирование' : 'Новый материал'}</h3>
          <div className="form-grid">
            <div className="form-group">
              <input
                type="text"
                placeholder="Название"
                value={formData.name}
                onChange={(e) => {
                  setFormData({ ...formData, name: e.target.value });
                  setErrors({ ...errors, name: null });
                }}
                className={errors.name ? 'input-error' : ''}
              />
              {errors.name && <span className="error-text"> {errors.name}</span>}
            </div>

            <div className="form-group">
              <input
                type="number"
                step="0.1"
                min="0"
                max="100"
                placeholder="% потерь (0-100)"
                value={formData.missingPercent}
                onChange={(e) => {
                  setFormData({ ...formData, missingPercent: e.target.value });
                  setErrors({ ...errors, missingPercent: null });
                }}
                className={errors.missingPercent ? 'input-error' : ''}
              />
              {errors.missingPercent && <span className="error-text"> {errors.missingPercent}</span>}
            </div>
          </div>
          <div className="form-actions">
            <button className="btn btn-primary" onClick={handleSave}>
              {editingId ? 'Сохранить' : 'Создать'}
            </button>
            <button className="btn btn-secondary" onClick={() => setShowForm(false)}>
              Отменить
            </button>
          </div>
        </div>
      )}

      <div className="table-wrapper">
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Название</th>
              <th>% потерь</th>
              <th>Действия</th>
            </tr>
          </thead>
          <tbody>
            {materials.map((material) => (
              <tr key={material.id}>
                <td className="text-muted">{material.id}</td>
                <td className="bold">{material.name}</td>
                <td>{parseFloat(material.missingPercent).toFixed(1)}%</td>
                <td className="actions">
                  <button className="btn btn-primary mr-10" onClick={() => {
                    setFormData({ name: material.name, missingPercent: material.missingPercent });
                    setEditingId(material.id);
                    setShowForm(true);
                    setErrors({});
                  }}>Редактировать</button>
                  <button className="btn btn-primary mr-10 btn-danger" onClick={() => handleDelete(material.id)}>Удалить</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function WorkshopsPage() {
  const [workshops, setWorkshops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ name: '', type: '', numberWorkers: '' });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    loadWorkshops();
  }, []);

  const loadWorkshops = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${API_URL}/workshops`);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();

      if (!Array.isArray(data)) {
        console.error('Ошибка: ответ не является массивом', data);
        throw new Error('Неправильный формат данных');
      }

      console.log(' Цехи загружены:', data);
      setWorkshops(data);
    } catch (err) {
      console.error(' Ошибка загрузки цехов:', err);
      setError(err.message);
      setWorkshops([]);
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    newErrors.name = validation.name(formData.name);
    newErrors.type = validation.name(formData.type);
    newErrors.numberWorkers = validation.positiveNumber(formData.numberWorkers, 'Количество рабочих');

    setErrors(newErrors);
    return Object.values(newErrors).every(err => !err);
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    try {
      const payload = {
        name: formData.name,
        type: formData.type,
        numberWorkers: parseInt(formData.numberWorkers),
      };

      const url = editingId ? `${API_URL}/workshops/${editingId}` : `${API_URL}/workshops`;
      const method = editingId ? 'PATCH' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error('Ошибка сохранения');

      await loadWorkshops();
      setShowForm(false);
      setEditingId(null);
      setFormData({ name: '', type: '', numberWorkers: '' });
      setErrors({});
      alert(editingId ? 'Цех обновлен' : 'Цех создан');
    } catch (err) {
      alert('Ошибка: ' + err.message);
    }
  };

  const handleEdit = (workshop) => {
    setFormData({
      name: workshop.name,
      type: workshop.type,
      numberWorkers: workshop.numberWorkers,
    });
    setEditingId(workshop.id);
    setShowForm(true);
    setErrors({});
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Удалить цех?')) return;

    try {
      const response = await fetch(`${API_URL}/workshops/${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Ошибка удаления');
      await loadWorkshops();
      alert('Цех удален');
    } catch (err) {
      alert('Ошибка: ' + err.message);
    }
  };

  if (loading) {
    return (
      <div className="page">
        <p style={{ textAlign: 'center' }}> Загрузка цехов...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page">
        <h2> Цехи производства</h2>
        <div className="error-message">
           Ошибка загрузки: {error}
        </div>
        <button className="btn btn-primary" onClick={loadWorkshops} style={{ marginTop: '10px' }}>
          Попробовать снова
        </button>
      </div>
    );
  }

  const totalWorkers = workshops.reduce((sum, w) => sum + (parseInt(w.numberWorkers) || 0), 0);
  const avgWorkers = workshops.length > 0 ? Math.round(totalWorkers / workshops.length) : 0;

  return (
    <div className="page">
      <div className="page-header">
        <h2> Цехи производства</h2>
        <button className="btn btn-primary" onClick={() => {
          if (showForm) {
            setShowForm(false);
            setEditingId(null);
            setFormData({ name: '', type: '', numberWorkers: '' });
            setErrors({});
          } else {
            setShowForm(true);
          }
        }}>
          {showForm ? 'Отменить' : '+ Добавить'}
        </button>
      </div>

      {showForm && (
        <div className="form-card">
          <h3>{editingId ? 'Редактирование' : 'Новый цех'}</h3>
          <div className="form-grid">
            <div className="form-group">
              <input
                type="text"
                placeholder="Название"
                value={formData.name}
                onChange={(e) => {
                  setFormData({ ...formData, name: e.target.value });
                  setErrors({ ...errors, name: null });
                }}
                className={errors.name ? 'input-error' : ''}
              />
              {errors.name && <span className="error-text"> {errors.name}</span>}
            </div>

            <div className="form-group">
              <input
                type="text"
                placeholder="Тип цеха"
                value={formData.type}
                onChange={(e) => {
                  setFormData({ ...formData, type: e.target.value });
                  setErrors({ ...errors, type: null });
                }}
                className={errors.type ? 'input-error' : ''}
              />
              {errors.type && <span className="error-text"> {errors.type}</span>}
            </div>

            <div className="form-group">
              <input
                type="number"
                min="1"
                placeholder="Количество рабочих"
                value={formData.numberWorkers}
                onChange={(e) => {
                  setFormData({ ...formData, numberWorkers: e.target.value });
                  setErrors({ ...errors, numberWorkers: null });
                }}
                className={errors.numberWorkers ? 'input-error' : ''}
              />
              {errors.numberWorkers && <span className="error-text"> {errors.numberWorkers}</span>}
            </div>
          </div>
          <div className="form-actions">
            <button className="btn btn-primary" onClick={handleSave}>
              {editingId ? 'Сохранить' : 'Создать'}
            </button>
            <button className="btn btn-secondary" onClick={() => setShowForm(false)}>
              Отменить
            </button>
          </div>
        </div>
      )}

      {workshops.length === 0 ? (
        <p style={{ textAlign: 'center', color: '#999', marginTop: '20px' }}>
          Цехи не найдены
        </p>
      ) : (
        <>
          <div className="cards-grid">
            {workshops.map((workshop) => (
              <div key={workshop.id} className="card">
                <div className="card-header">
                  <h3>{workshop.name || 'Без названия'}</h3>
                  <span className="card-badge">{workshop.type || 'Общий'}</span>
                </div>
                <div className="card-body">
                  <div className="card-stat">
                    <span> Рабочих:</span>
                    <strong>{workshop.numberWorkers || 0}</strong>
                  </div>
                  {workshop.createdAt && (
                    <div className="card-stat">
                      <span> Создан:</span>
                      <strong>{new Date(workshop.createdAt).toLocaleDateString('ru-RU')}</strong>
                    </div>
                  )}
                  <div className="card-stat">
                    <span> ID:</span>
                    <strong>{workshop.id}</strong>
                  </div>
                </div>
                <div className="card-actions" style={{ padding: '10px 15px', borderTop: '1px solid #e0e0e0', display: 'flex', gap: '8px', justifyContent: 'center' }}>
                  <button className="btn btn-primaryn mr-10" onClick={() => handleEdit(workshop)} title="Редактировать">Редактировать</button>
                  <button className="btn btn-primary mr-10" onClick={() => handleDelete(workshop.id)} title="Удалить">Удалить</button>
                </div>
              </div>
            ))}
          </div>

          {/* <div className="summary-card">
            <div className="summary-stat">
              <div className="summary-label">Всего цехов</div>
              <div className="summary-value">{workshops.length}</div>
            </div>
            <div className="summary-stat">
              <div className="summary-label">Всего рабочих</div>
              <div className="summary-value">{totalWorkers}</div>
            </div>
            <div className="summary-stat">
              <div className="summary-label">Среднее на цех</div>
              <div className="summary-value">{avgWorkers}</div>
            </div>
          </div> */}
        </>
      )}
    </div>
  );
}



function Navigation() {
  const location = useLocation();

  const isActive = (path) => location.pathname === path ? 'active' : '';

  return (
    <nav className="sidebar">
      <div className="nav-header">
        <h2> Мебель</h2>
      </div>
      <div className="nav-links">
        <Link to="/" className={`nav-link ${isActive('/')}`}> Главная</Link>
        <Link to="/calculator" className={`nav-link ${isActive('/calculator')}`}> Калькулятор</Link>
        <Link to="/products" className={`nav-link ${isActive('/products')}`}> Продукты</Link>
        <Link to="/types" className={`nav-link ${isActive('/types')}`}> Типы</Link>
        <Link to="/materials" className={`nav-link ${isActive('/materials')}`}> Материалы</Link>
        <Link to="/workshops" className={`nav-link ${isActive('/workshops')}`}> Цехи</Link>
      </div>
    </nav>
  );
}

function App() {
  return (
    <Router>
      <div className="app">
        <header className="app-header">
          <div className="header-content">
            <h1>Mebel</h1>
          </div>
        </header>

        <div className="app-layout">
          <Navigation />
          <main className="app-main">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/calculator" element={<CalculatorPage />} />
              <Route path="/products" element={<ProductsPage />} />
              <Route path="/types" element={<ProductTypesPage />} />
              <Route path="/materials" element={<MaterialsPage />} />
              <Route path="/workshops" element={<WorkshopsPage />} />
            </Routes>
          </main>
        </div>

        <footer className="app-footer">
          <p>© 2025 Система управления производством. Все права защищены.</p>
        </footer>
      </div>
    </Router>
  );
}

export default App;
