<template>
  <v-layout align-start>
    <v-flex>
      <v-data-table
        :headers="headers"
        :items="categorias"
        :search="search"
        sort-by="calories"
        class="elevation-1"
      >
        <template v-slot:[`item.estado`]="{ item }">
          <v-chip :color="getColor(item.estado)" dark>
            <div v-if="item.estado"><span> Activo</span></div>
            <div v-else><span> Inactivo</span></div>
          </v-chip>
        </template>
        <template v-slot:top>
          <v-toolbar flat>
            <v-toolbar-title>Categorias</v-toolbar-title>
            <v-divider class="mx-4" inset vertical></v-divider>
            <v-spacer></v-spacer>
            <v-text-field
              class="text-xs-center"
              v-model="search"
              append-icon="search"
              label="Búsqueda"
              single-line
              justify-center
              hide-details
            ></v-text-field>

            <v-spacer></v-spacer>
            <v-dialog v-model="dialog" max-width="500px">
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  color="primary"
                  dark
                  class="mb-2"
                  v-bind="attrs"
                  v-on="on"
                >
                  Nuevo
                </v-btn>
              </template>
              <v-card>
                <v-card-title>
                  <span class="headline">{{ formTitle }}</span>
                </v-card-title>

                <v-card-text>
                  <v-container>
                    <v-row>
                      <v-col cols="12" sm="12" md="12">
                        <v-text-field
                          v-model="nombre"
                          label="Nombre"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="12" md="12">
                        <v-textarea
                          v-model="descripcion"
                          label="Descripción"
                        ></v-textarea>
                      </v-col>
                      <v-col cols="12" sm="12" md="12" v-show="valida">
                        <div
                          class="red--text"
                          v-for="v in validaMensaje"
                          :key="v"
                          v-text="v"
                        ></div>
                      </v-col>
                    </v-row>
                  </v-container>
                </v-card-text>

                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="blue darken-1" text @click="close">
                    Cancelar
                  </v-btn>
                  <v-btn color="blue darken-1" text @click="guardar">
                    Guardar
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
            <v-dialog v-model="dialogDelete" max-width="500px">
              <v-card>
                <v-card-title class="headline"
                  >Are you sure you want to delete this item?</v-card-title
                >
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="blue darken-1" text @click="closeDelete"
                    >Cancel</v-btn
                  >
                  <v-btn color="blue darken-1" text @click="deleteItemConfirm"
                    >OK</v-btn
                  >
                  <v-spacer></v-spacer>
                </v-card-actions>
              </v-card>
            </v-dialog>
            <v-dialog v-model="adModal" max-width="290">
              <v-card
                ><v-card-title class="headline" v-if="adAccion == 1"
                  >Activar Item</v-card-title
                ><v-card-title class="headline" v-if="adAccion == 2"
                  >Desactivar Item</v-card-title
                ><v-card-text
                  >Estas a punto de <span v-if="adAccion == 1"> activar</span
                  ><span v-else> desactivar</span> el item
                  <span class="font-weight-bold">{{
                    adNombre
                  }}</span></v-card-text
                >
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn
                    @click="activarDesactivarCerrar()"
                    class="green--text text--darken-1"
                    flat="flat"
                    >Cancelar</v-btn
                  >

                  <v-btn
                    v-if="adAccion == 1"
                    @click="activar()"
                    class="orange--text text--darken-4"
                    flat="flat"
                    >Activar</v-btn
                  >
                  <v-btn
                    v-if="adAccion == 2"
                    @click="desactivar()"
                    class="orange--text text--darken-4"
                    flat="flat"
                    >Desactivar</v-btn
                  >
                </v-card-actions>
              </v-card>
            </v-dialog>
          </v-toolbar>
        </template>
        <template v-slot:[`item.acciones`]="{ item }">
          <v-flex>
            <v-icon small class="mr-2 orange--text" @click="editItem(item)"
              >edit
            </v-icon>
            <span v-if="item.estado">
              <v-icon
                small
                class="mr-2 blue--text"
                @click="activarDesactivarMostrar(2, item)"
                >check
              </v-icon>
            </span>
            <span v-else>
              <v-icon
                small
                class="mr-2 red--text"
                @click="activarDesactivarMostrar(1, item)"
                >block
              </v-icon>
            </span>
          </v-flex>
        </template>
        <template v-slot:no-data>
          <v-btn color="primary" @click="initialize">
            Reset
          </v-btn>
        </template>
      </v-data-table>
    </v-flex>
  </v-layout>
</template>
<script>
import axios from "axios";
export default {
  data: () => ({
    dialog: false,
    search: "",
    categorias: [],

    headers: [
      { text: "Nombre", value: "nombre", sortable: true },
      { text: "Descripcion", value: "descripcion", sortable: false },
      { text: "Estado", value: "estado", sortable: false },
      { text: "Acciones", value: "acciones", sortable: false }
    ],

    editedIndex: -1,
    _id: "",
    nombre: "",
    descripcion: "",
    valida: 0,
    validaMensaje: [],
    adModal: 0,
    adAccion: 0,
    adNombre: "",
    adId: ""
  }),

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "Nuevo registro" : "Editar registro";
    }
  },

  watch: {
    dialog(val) {
      val || this.close();
    },
    dialogDelete(val) {
      val || this.closeDelete();
    }
  },

  created() {
    this.listar();
  },

  methods: {
    getColor(estado) {
      if (estado) {
        return "green";
      } else {
        return "red";
      }
    },
    validar() {
      this.valida = 0;
      this.validaMensaje = [];
      if (this.nombre.length < 1 || this.nombre.length > 50) {
        this.validaMensaje.push(
          "El nombre de la categoria debe tener entre 1-50 caracteres."
        );
      }
      if (this.descripcion.length > 255) {
        this.validaMensaje.push(
          "La descripción de la categoria no debe tener más de 255 caracteres."
        );
      }
      if (this.validaMensaje.length) {
        this.valida = 1;
      }
      return this.valida;
    },
    listar() {
      let me = this;
      let header = { token: this.$store.state.token };
      let configuracion = { headers: header };
      axios
        .get("categoria/list", configuracion)
        .then(function(response) {
          me.categorias = response.data;
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    limpiar() {
      this._id = "";
      this.nombre = "";
      this.descripcion = "";
      this.valida = 0;
      this.validaMensaje = [];
      this.editedIndex = -1;
    },

    guardar() {
      let me = this;
      let header = { token: this.$store.state.token };
      let configuracion = { headers: header };
      if (this.validar()) {
        return;
      }
      if (this.editedIndex > -1) {
        //Codigo para editar
        axios
          .put(
            "categoria/update",
            {
              _id: this._id,
              nombre: this.nombre,
              descripcion: this.descripcion
            },
            configuracion
          )
          .then(function(response) {
            me.limpiar();
            me.close();
            me.listar();
          })
          .catch(function(error) {
            console.log(error);
          });
      } else {
        //Codigo para guardar
        axios
          .post(
            "categoria/add",
            {
              nombre: this.nombre,
              descripcion: this.descripcion
            },
            configuracion
          )
          .then(function(response) {
            me.limpiar();
            me.close();
            me.listar();
          })
          .catch(function(error) {
            console.log(error);
          });
      }
    },
    activarDesactivarCerrar() {
      this.adModal = 0;
    },
    editItem(item) {
      this._id = item._id;
      this.nombre = item.nombre;
      this.descripcion = item.descripcion;
      this.dialog = true;
      this.editedIndex = 1;
    },

    activarDesactivarMostrar(accion, item) {
      this.adModal = 1;
      this.adNombre = item.nombre;
      this.adId = item._id;

      if (accion == 1) {
        this.adAccion = 1;
      } else if (accion == 2) {
        this.adAccion = 2;
      } else {
        this.adAccion = 0;
      }
    },

    deleteItemConfirm() {
      this.desserts.splice(this.editedIndex, 1);
      this.closeDelete();
    },
    activar() {
      let me = this;
      let header = { token: this.$store.state.token };
      let configuracion = { headers: header };
      axios
        .put(
          "categoria/activate",
          {
            _id: this.adId
          },
          configuracion
        )
        .then(function(response) {
          me.adModal = 0;
          me.adAccion = 0;
          me.adNombre = "";
          me.adId = "";
          me.listar();
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    desactivar() {
      let me = this;
      let header = { token: this.$store.state.token };
      let configuracion = { headers: header };
      axios
        .put(
          "categoria/deactivate",
          {
            _id: this.adId
          },
          configuracion
        )
        .then(function(response) {
          me.adModal = 0;
          me.adAccion = 0;
          me.adId = "";
          me.adNombre = "";
          me.listar();
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    close() {
      this.dialog = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },

    closeDelete() {
      this.dialogDelete = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    }
  }
};
</script>
